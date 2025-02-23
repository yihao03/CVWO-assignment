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
	Parent   uint   `json:"parent_id"`
	Tag      string `gorm:"default:general" json:"tag"`
}

type Vote struct {
	gorm.Model
	UserID uint `json:"user_id"`
	PostID uint `json:"post_id"`
	Vote   bool `json:"vote"`
}
