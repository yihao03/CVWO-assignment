package controllers

import (
	"backend/initializers"
	"backend/model"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Post(c *gin.Context) {
	var body struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		Username string `json:"username"`
		UserID   uint   `json:"user_id"`
		ParentID uint   `json:"parent_id"`
		Tag      string `json:"tag"`
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
		Parent:   body.ParentID,
		Tag:      body.Tag,
	}
	result := initializers.Database.Create(&post)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "Post created successfully"})
	}
}

func GetAllPost(c *gin.Context) {
	limit := 10
	cursor := c.Query("cursor")
	postID := c.Query("post_id")
	userID := c.Query("user_id")
	parent := c.Query("parent_id")
	currUser := c.Query("curr_user")
	tag := c.Query("tag")

	type PostWithVote struct {
		model.Post
		Count     int   `json:"count"`
		UserVoted *bool `json:"userVoted,omitempty"`
	}

	type Vote struct {
		PostID    uint `json:"postID"`
		Count     int  `json:"count"`
		UserVoted bool `json:"userVoted"`
	}

	var posts []model.Post
	query := initializers.Database

	//check cursor
	if cursor != "" {
		parsedCursor, err := time.Parse(time.RFC3339, cursor)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cursor format"})
			return
		}
		query = query.Where("created_at < ?", parsedCursor)
	}

	//add post_id to query if available
	if postID != "" {
		fmt.Println("find post by post id:", postID)
		query = query.Where("ID = ?", postID)
	}

	//add user_id to query if available
	if userID != "" {
		fmt.Println("find post by user id:", userID)
		query = query.Where("user_id = ?", userID)
	}

	//add parent id to query if available
	if parent != "" {
		fmt.Println("find post by parent id:", parent)
		query = query.Where("parent = ?", parent)
	}

	//add tags to query if available
	if tag != "" {
		fmt.Println("find post by tag id:", tag)
		query = query.Where("tag = ?", tag)
	}

	//check query, bind and check for error
	if err := query.Order("created_at DESC").Limit(limit).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	//return early if no posts are present
	if len(posts) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"post": posts,
		})
		return
	}

	//manage votes
	//collect post IDs
	postIDs := make([]uint, len(posts))
	for i, post := range posts {
		postIDs[i] = post.ID
	}

	var voteCounts []Vote

	//calculate votes
	voteQuery := `
		SELECT 
			post_id,
			SUM(CASE WHEN vote = true THEN 1 WHEN vote = false THEN -1 ELSE 0 END) as count
		FROM votes 
		WHERE post_id IN (?) AND deleted_at IS NULL
		GROUP BY post_id`

	if err := initializers.Database.Raw(voteQuery, postIDs).Scan(&voteCounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch votes"})
		return
	}

	voteCountsMap := make(map[uint]int)
	for _, vc := range voteCounts {
		voteCountsMap[vc.PostID] = vc.Count
	}

	// Get user votes in a single query if currUser is provided
	userVoteMap := make(map[uint]bool)
	if currUser != "" {
		var userVotes []model.Vote
		if err := initializers.Database.Where("user_id = ? AND post_id IN (?)", currUser, postIDs).Find(&userVotes).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user votes"})
			return
		}
		for _, vote := range userVotes {
			userVoteMap[vote.PostID] = vote.Vote
		}
	}

	// Combine all data
	postsWithVotes := make([]PostWithVote, len(posts))
	for i, post := range posts {
		postsWithVotes[i] = PostWithVote{
			Post:  post,
			Count: voteCountsMap[post.ID],
		}
		if currUser != "" {
			if vote, exists := userVoteMap[post.ID]; exists {
				postsWithVotes[i].UserVoted = &vote
			}
		}
	}

	// Return response with next cursor
	nextCursor := posts[len(posts)-1].CreatedAt.Format(time.RFC3339)
	c.JSON(http.StatusOK, gin.H{
		"posts":      postsWithVotes,
		"nextCursor": nextCursor,
	})

}

func SearchPost(c *gin.Context) {
	search := c.Query("search")

	var posts []model.Post

	searchArr := strings.Split(search, " ")

	query := initializers.Database
	for index, elem := range searchArr {
		fmt.Println("Adding keyword:", index, elem)
		query = query.Where("content LIKE ?", "%"+elem+"%")
	}

	//check query, bind and check for error
	if err := query.Order("created_at DESC").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
	})
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		UserID  uint   `json:"user_id"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var post model.Post

	err := initializers.Database.First(&post, id)

	//check if post is in the database
	if errors.Is(err.Error, gorm.ErrRecordNotFound) {
		c.JSON(404, gin.H{"error": "Post not found"})
		return
	}

	//check if user is authorised to edit post
	if post.UserID != body.UserID {

		//if editor is not the author of the post, check if user is admin
		var user model.User
		result := initializers.Database.First(&user, body.UserID)

		if result.Error != nil {
			c.JSON(400, gin.H{"error": "User not found"})
			return
		}

		//if user is not admin, return an error
		if !user.Admin {
			c.JSON(400, gin.H{"error": "unauthorised user"})
			return
		}

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
