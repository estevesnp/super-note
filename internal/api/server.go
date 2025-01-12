package api

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"super-note/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

const conflictError = "23505"

var (
	internalServerError = gin.H{"error": "Internal Server Error"}
	badRequest          = gin.H{"error": "Bad Request"}
)

type Server struct {
	ctx            context.Context
	addr           string
	secret         string
	trustedProxies string
	allowOrigins   string
	router         *gin.Engine

	db *pgx.Conn
}

type Config struct {
	Addr           string
	SecretKey      string
	TrustedProxies string
	AllowOrigins   string
}

func New(ctx context.Context, db *pgx.Conn, cfg Config) *Server {
	if err := validateConfig(cfg); err != nil {
		log.Fatalf("error validating config: %v", err)
	}

	server := &Server{
		ctx:            ctx,
		addr:           cfg.Addr,
		secret:         cfg.SecretKey,
		trustedProxies: cfg.TrustedProxies,
		allowOrigins:   cfg.AllowOrigins,
		router:         gin.Default(),
		db:             db,
	}

	if err := server.setupEndpoints(); err != nil {
		log.Fatalf("error setting up endpoints: %v", err)
	}

	return server
}

func validateConfig(cfg Config) error {
	if cfg.Addr == "" {
		return errors.New("no addr set")
	}

	if cfg.SecretKey == "" {
		return errors.New("no secret key set")
	}

	if cfg.TrustedProxies == "" {
		return errors.New("no trusted proxies set")
	}

	if cfg.AllowOrigins == "" {
		return errors.New("no allowed origins set")
	}

	return nil
}

func (s *Server) Listen() error {
	return s.router.Run(s.addr)
}

func (s *Server) setupEndpoints() error {
	if err := s.router.SetTrustedProxies([]string{s.trustedProxies}); err != nil {
		return err
	}

	s.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{s.allowOrigins},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	s.router.GET("/", func(c *gin.Context) {
		fmt.Fprint(c.Writer, "Hello, World!\n")
	})

	protected := s.router.Group("/secret")
	protected.Use(s.AuthMiddleware)
	{
		protected.GET("/", func(c *gin.Context) {
			user := c.GetString("username")
			c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Hello, %s!\n", user)})
		})
	}

	lists := s.router.Group("/lists")
	lists.Use(s.AuthMiddleware)
	{
		lists.POST("/", s.createListHandler)
	}

	s.router.POST("/login", s.loginHandler)
	s.router.POST("/register", s.registerHandler)

	s.router.GET("/users", s.getUsersHandler)

	return nil
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
