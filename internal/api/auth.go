package api

import (
	"errors"
	"log"
	"net/http"
	"strings"
	"super-note/internal/repository"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

const tokenExpire = 24 * time.Hour

type UserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserClaim struct {
	UserID   uuid.UUID `json:"user_id"`
	Username string    `json:"username"`

	jwt.RegisteredClaims
}

type Token struct {
	Jwt string `json:"jwt"`
}

type LoggedInUser struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
}

func generateJWT(secret string, user LoggedInUser) (string, error) {
	claim := UserClaim{
		UserID:   user.ID,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpire)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	return token.SignedString([]byte(secret))
}

func (s *Server) AuthMiddleware(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no token provided"})
		c.Abort()
		return
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	claims := &UserClaim{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return []byte(s.secret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		c.Abort()
		return
	}

	c.Set("userID", claims.UserID)
	c.Set("username", claims.Username)
	c.Next()
}

func (s *Server) registerHandler(c *gin.Context) {
	var req UserRequest

	if err := c.BindJSON(&req); err != nil {
		log.Printf("error parsing request: %v", err)
		c.JSON(http.StatusBadRequest, badRequest)
		return
	}

	username := strings.TrimSpace(req.Username)
	pass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("error encrypting password: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	user, err := s.repo().CreateUser(s.ctx, repository.CreateUserParams{
		Username: username,
		Password: string(pass),
	})
	if err != nil {
		var pgError *pgconn.PgError
		if !errors.As(err, &pgError) && pgError.Code != conflictError {
			log.Printf("error creating user: %v", err)
			c.JSON(http.StatusInternalServerError, internalServerError)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user already exists"})
		}
		return
	}

	token, err := generateJWT(s.secret, LoggedInUser{
		ID:       user.ID,
		Username: user.Username,
	})
	if err != nil {
		log.Printf("error generating jwt: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	c.JSON(http.StatusCreated, Token{token})
}

func (s *Server) loginHandler(c *gin.Context) {
	var req UserRequest
	if err := c.BindJSON(&req); err != nil {
		log.Printf("error parsing request: %v", err)
		c.JSON(http.StatusBadRequest, badRequest)
		return
	}

	username := strings.TrimSpace(req.Username)

	user, err := s.repo().GetUserByUsername(s.ctx, username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No matching user found"})
		} else {
			log.Printf("error fetching password: %v", err)
			c.JSON(http.StatusInternalServerError, internalServerError)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No matching user found"})
		} else {
			log.Printf("error comparing password: %v", err)
			c.JSON(http.StatusInternalServerError, internalServerError)
		}
		return
	}

	token, err := generateJWT(s.secret, LoggedInUser{
		ID:       user.ID,
		Username: user.Username,
	})
	if err != nil {
		log.Printf("error generating jwt: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	c.JSON(http.StatusOK, Token{token})
}
