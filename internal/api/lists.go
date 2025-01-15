package api

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"super-note/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateListRequest struct {
	name        string
	description string
}

func extractID(c *gin.Context) (uuid.UUID, error) {
	id, ok := c.Get("userID")
	if !ok {
		return uuid.UUID{}, errors.New("no userID found in context")
	}

	userID, ok := id.(uuid.UUID)
	if !ok {
		return uuid.UUID{}, fmt.Errorf("userID (%v) is incorrect type (%T)", id, id)
	}

	return userID, nil
}

func (s *Server) createListHandler(c *gin.Context) {
	userID, err := extractID(c)
	if err != nil {
		log.Printf("error extracting id: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	var req CreateListRequest
	if err := c.BindJSON(&req); err != nil {
		log.Printf("error parsing request: %v", err)
		c.JSON(http.StatusBadRequest, badRequest)
		return
	}

	list, err := s.repo().CreateList(s.ctx, repository.CreateListParams{
		UserID:      userID,
		Name:        req.name,
		Description: req.description,
	})
	if err != nil {
		log.Printf("error creating list: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	c.JSON(http.StatusCreated, list)
}

func (s *Server) getListsHandler(c *gin.Context) {
	userID, err := extractID(c)
	if err != nil {
		log.Printf("error extracting id: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	lists, err := s.repo().GetListsByUser(s.ctx, userID)
	if err != nil {
		log.Printf("error extracting id: %v", err)
		c.JSON(http.StatusInternalServerError, internalServerError)
		return
	}

	c.JSON(http.StatusOK, lists)
}
