package controllers

import (
	"backend/initializers"
	"backend/model"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Post(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		UserID   uint   `json:"user_id"`
		Title    string `json:"title"`
		Content  string `json:"content"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	post := model.Post{
		Username: body.Username,
		UserID:   body.UserID,
		Title:    body.Title,
		Content:  body.Content,
	}
	result := initializers.Database.Create(&post)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "Post created successfully"})
	}
}

func GetPost(c *gin.Context) {
	id := c.Param("id")
	var post model.Post
	initializers.Database.First(&post, id)

	c.JSON(200, gin.H{"post": post})
}

func GetAllPost(c *gin.Context) {
	limit := 10
	cursor := c.Query("cursor")
	postID := c.Query("post_id")
	userID := c.Query("user_id")

	var post []model.Post
	var query *gorm.DB

	//check cursor
	if cursor != "" {
			parsedCursor, err := time.Parse(time.RFC3339, cursor)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cursor format"})
				return
			}
			query = initializers.Database.Where("created_at < ?", parsedCursor)
		} else {
			query = initializers.Database
		}

	//check post or user requirement
	if postID == "" && userID == "" {
		fmt.Println("return all posts")
	} else if postID != "" {
		fmt.Println("find post by post id:", postID)
		query = query.Where("post_id = ?", postID)
	} else {
		fmt.Println("find post by user id:", postID)
		query = query.Where("user_id = ?", userID)
	}

	if err := query.Order("created_at DESC").Limit(limit).Find(&post).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
			return
		}

		// Generate the next cursor
		var nextCursor string
		if len(post) > 0 {
			nextCursor = post[len(post)-1].CreatedAt.Format(time.RFC3339)
			c.JSON(http.StatusOK, gin.H{
			"post":       post,
			"nextCursor": nextCursor,
			})
			return;
		}

		c.JSON(http.StatusOK, gin.H{
			"post": post,
		})
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Title   string `json:"title"`
		Content string `json:"body"`
		UserID  uint   `json:"user_id"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var post model.Post

	err := initializers.Database.First(&post, id)

	var userid uint = body.UserID
	var ptr *uint = &userid

	if &post.UserID != ptr {
		c.JSON(400, gin.H{"error": "post user_id not exist"})
	}

	if errors.Is(err.Error, gorm.ErrRecordNotFound) {
		c.JSON(404, gin.H{"error": "Post not found"})
		return
	}
	initializers.Database.Model(&post).Updates(model.Post{
		Title:   body.Title,
		Content: body.Content,
		UserID:  body.UserID,
	})

	c.JSON(200, gin.H{"message": "Post updated successfully"})
}

func DeletePost(c *gin.Context) {
	//Get post id from url
	id := c.Param("id")

	var post model.Post
	//Get Post
	err := initializers.Database.First(&post, id)

	if errors.Is(err.Error, gorm.ErrRecordNotFound) {
		c.JSON(404, gin.H{"error": "Post not found"})
		return
	}
	//Delete Post
	initializers.Database.Delete(&post)
	//Return status
	c.JSON(200, gin.H{"Deleted at": &post.DeletedAt})
}