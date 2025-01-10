package api

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"super-note/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type Server struct {
	ctx     context.Context
	addr    string
	secret  string
	handler *gin.Engine
	db      *pgx.Conn
}

type Config struct {
	Addr      string
	SecretKey string
}

func New(ctx context.Context, db *pgx.Conn, cfg Config) *Server {
	if err := validateConfig(cfg); err != nil {
		panic(err)
	}

	server := &Server{
		ctx:     ctx,
		addr:    cfg.Addr,
		secret:  cfg.SecretKey,
		handler: gin.Default(),
		db:      db,
	}

	server.setupEndpoints()

	return server
}

func validateConfig(cfg Config) error {
	if cfg.Addr == "" {
		return errors.New("no addr set")
	}

	if cfg.SecretKey == "" {
		return errors.New("no secret key set")
	}

	return nil
}

const conflictError = "23505"

var (
	internalServerError = gin.H{"error": "Internal Server Error"}
	badRequest          = gin.H{"error": "Bad Request"}
)

func (s *Server) Listen() error {
	return s.handler.Run(s.addr)
}

func (s *Server) setupEndpoints() {
	s.handler.GET("/", func(c *gin.Context) {
		fmt.Fprint(c.Writer, "Hello, World!\n")
	})

	protected := s.handler.Group("/secret")
	protected.Use(s.AuthMiddleware)
	{
		protected.GET("/", func(c *gin.Context) {
			user := c.GetString("username")

			c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Hello, %s!\n", user)})
		})
	}

	s.handler.POST("/login", s.loginHandler)
	s.handler.POST("/register", s.registerHandler)

	s.handler.GET("/users", s.getUsersHandler)
}

func (s *Server) getUsersHandler(c *gin.Context) {
	users, err := repository.New(s.db).GetAllUsers(s.ctx)
	if err != nil {
		log.Printf("error on /users: %v\n", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	c.JSON(http.StatusOK, users)
}
