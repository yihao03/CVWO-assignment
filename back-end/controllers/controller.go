package controllers

import (
	"backend/initializers"
	"backend/model"
	"github.com/gin-gonic/gin"
)

func Post(c *gin.Context) {
	var body struct {
		Title  string `json:"title"`
		Body   string `json:"body"`
		UserID uint   `json:"user_id"`
	}

	c.Bind(&body)

	entries := model.Entry{
		Title:   body.Title,
		Content: body.Body,
		UserID:  body.UserID,
	}
	result := initializers.Database.Create(&entries)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "Post created successfully"})
	}
}

func GetPost(c *gin.Context) {
	id := c.Param("id")
	var entries model.Entry
	initializers.Database.First(&entries, id)

	c.JSON(200, gin.H{"entries": entries})
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Title   string `json:"title"`
		Content string `json:"body"`
		UserID  uint   `json:"user_id"`
	}
	c.Bind(&body)

	var entries model.Entry
	initializers.Database.First(&entries, id)
	initializers.Database.Model(&entries).Updates(model.Entry{
		Title:   body.Title,
		Content: body.Content,
		UserID:  body.UserID,
	})

	c.JSON(200, gin.H{"message": "Post updated successfully"})
}

func DeletePost(c *gin.Context) {
	//Get post id from url
	id := c.Param("id")

	var entries model.Entry
	//Get Post
	initializers.Database.First(&entries, id)
	//Delete Post
	initializers.Database.Delete(&entries)
	//Return status
	c.JSON(200, gin.H{"Deleted at": &entries.DeletedAt})
}
func CreateUser(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	c.Bind(&body)

	users := model.User{
		Username: body.Username,
		Password: body.Password,
	}
	result := initializers.Database.Create(&users)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "User created successfully"})
	}
}

func GetUsers(c *gin.Context) {
	id := c.Param("username")
	var users model.User
	initializers.Database.Where("username = ?", id).Find(&users)

	c.JSON(200, gin.H{"users": users})
}

func UpdateUser(c *gin.Context) {
	id := c.Param("username")

	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	c.Bind(&body)

	var users model.User
	initializers.Database.First(&users, id)
	initializers.Database.Model(&users).Updates(model.User{
		Username: body.Username,
		Password: body.Password,
	})

	c.JSON(200, gin.H{"message": "User updated successfully"})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("username")
	var users model.User
	initializers.Database.First(&users, id)
	initializers.Database.Delete(&users)
	c.JSON(200, gin.H{"message": "User deleted successfully"})
}
