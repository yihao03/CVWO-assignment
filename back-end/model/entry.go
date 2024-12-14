package model

import "gorm.io/gorm"

type Entry struct {
	gorm.Model
	UserID  uint   `json:"user_id"`
	Title   string `gorm:"size:255" json:"title"`
	Content string `gorm:"type:text" json:"content"`
}
