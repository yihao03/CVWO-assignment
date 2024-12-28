package model

import (
	"gorm.io/gorm"
)

type Tag struct {
	gorm.Model
	Tag   string `json:"tag"`
	Color string `json:"color"`
}
