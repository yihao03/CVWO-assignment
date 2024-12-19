package controllers

import (
	"backend/initializers"
	"backend/model"
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetVotes(c *gin.Context) {
	PostID := c.Query("post_id")
	UserID := c.Query("user_id")

	var countUp int64
	var countDown int64

	var voted model.Vote

	upvotes := initializers.Database.Model(&model.Vote{}).Where("post_id = ? AND vote = true", PostID).Count(&countUp)
	downvotes := initializers.Database.Model(&model.Vote{}).Where("post_id = ? AND vote = false", PostID).Count(&countDown)

	uperr := upvotes.Error
	downerr := downvotes.Error

	if uperr != nil && downerr != nil {
		fmt.Println(uperr, downerr)
		c.JSON(500, gin.H{"errorUpvote": uperr,
			"errorDownvote": downerr})
		return
	}

	//calculating net vote
	count := countUp - countDown

	//check if user has voted
	result := initializers.Database.Where("user_id = ? AND post_id = ?", UserID, PostID).First(&voted)
	if UserID != "" {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// User has not voted
			c.JSON(200, gin.H{
				"count": count,
			})
		} else if result.Error != nil {
			// Handle unexpected errors
			c.JSON(500, gin.H{
				"error": result.Error.Error(),
			})
		} else {
			// User has voted
			c.JSON(200, gin.H{
				"count":     count,
				"userVoted": voted.Vote,
			})
		}
	} else {
		// No UserID provided, return count only
		c.JSON(200, gin.H{
			"count": count,
		})
	}

}

func CreateVotes(c *gin.Context) {
	var body struct {
		PostID uint `json:"post_id"`
		UserID uint `json:"user_id"`
		Vote   bool `json:"vote"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err})
		return
	}

	vote := model.Vote{
		PostID: body.PostID,
		UserID: body.UserID,
		Vote:   body.Vote,
	}

	result := initializers.Database.Table("votes").Create(&vote)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "voted successfully"})
	}
}

func DeleteVote(c *gin.Context) {
	PostID := c.Query("post_id")
	UserID := c.Query("user_id")

	var vote model.Vote

	if err := initializers.Database.
		Where("post_id = ? AND user_id = ?", PostID, UserID).
		First(&vote).Error; err != nil {
		c.JSON(404, gin.H{"error": "vote not found"})
		return
	}

	fmt.Println("Deleting post", PostID, UserID)
	initializers.Database.Delete(&vote)

	// Return success
	c.JSON(200, "vote removed successfully")
}
