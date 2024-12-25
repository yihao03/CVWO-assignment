package model

import (
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Title    string `gorm:"size:255" json:"title"`
	Content  string `gorm:"type:text" json:"content"`
	Pinned   bool   `json:"pinned"`
	Tag      string `json:"tag"`
	Parent   uint   `json:"parent_id"`
}

type Vote struct {
	gorm.Model
	UserID uint `json:"user_id"`
	PostID uint `json:"post_id"`
	Vote   bool `json:"vote"`
}

type Tag struct {
	gorm.Model
	Tag string
}
