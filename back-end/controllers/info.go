package controllers

import (
	"backend/initializers"
	"backend/model"

	"github.com/gin-gonic/gin"
)

func GetInfo(c *gin.Context) {
	var info []model.Info
	initializers.Database.Find(&info)

	// Transform the array of objects into a map
	infoMap := make(map[string]interface{})
	for _, item := range info {
		infoMap[item.Name] = item.Value
	}

	c.JSON(200, gin.H{"info": infoMap})
}
