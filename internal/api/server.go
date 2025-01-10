package api

import (
	"context"
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
	handler *gin.Engine
	db      *pgx.Conn
}

func New(ctx context.Context, db *pgx.Conn, addr string) *Server {
	server := &Server{
		ctx:     ctx,
		addr:    addr,
		handler: gin.Default(),
		db:      db,
	}

	server.registerHandler()

	return server
}

func (s *Server) Listen() error {
	return s.handler.Run()
}

func (s *Server) registerHandler() {
	s.handler.GET("/", func(c *gin.Context) {
		fmt.Fprint(c.Writer, "Hello, World!\n")
	})

	s.handler.GET("/users", s.getUsersHandler)
}

func (s *Server) getUsersHandler(c *gin.Context) {
	users, err := repository.New(s.db).GetAllUsers(s.ctx)
	if err != nil {
		log.Printf("error on /users: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, users)
}
