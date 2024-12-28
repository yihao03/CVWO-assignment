package controllers

import (
	"backend/initializers"
	"backend/model"

	"github.com/gin-gonic/gin"
)

func GetTags(c *gin.Context) {
	var tags []model.Tag
	initializers.Database.Find(&tags)

	c.JSON(200, gin.H{"tags": tags})
}
