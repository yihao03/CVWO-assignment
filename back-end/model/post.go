package model

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	UserID  uint   `json:"user_id"`
	Title   string `gorm:"size:255" json:"title"`
	Content string `gorm:"type:text" json:"content"`
}

type Like struct {
	gorm.Model
	UserID uint `json:"user_id"`
	PostID uint `json:"post_id"`
	Post   Post
}
