package controllers

import (
	"backend/initializers"
	"backend/model"
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetVotes(c *gin.Context) {
	PostID := c.Query("post_id")
	UserID := c.Query("user_id")

	var countUp int64
	var countDown int64

	var voted model.Vote

	upvotes := initializers.Database.Table("votes").Where("post_id = ? AND vote = true", PostID).Count(&countUp)
	downvotes := initializers.Database.Table("votes").Where("post_id = ? AND vote = false", PostID).Count(&countDown)

	uperr := upvotes.Error
	downerr := downvotes.Error
	if uperr != nil && downerr != nil {
		fmt.Println(uperr, downerr)
		c.JSON(500, gin.H{"errorUpvote": uperr,
			"errorDownvote": downerr})
		return
	}

	count := countUp - countDown
	if UserID != "" && initializers.Database.Where("user_id = ?", UserID).Find(&voted).Error != nil {
		user_voted := voted.Vote
		c.JSON(200, gin.H{"count": count,
			"userVoted": user_voted})
	} else {
		c.JSON(200, gin.H{"count": count})
	}

}

func CreateVotes(c *gin.Context) {
	var body struct {
		PostID string `json:"post_id"`
		UserID uint   `json:"user_id"`
		Vote   bool   `json:"vote"`
	}

	if err := c.Bind(&body); err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{"error": err})
		return
	}

	result := initializers.Database.Table("votes").Create(&body)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "voted successfully"})
	}
}
