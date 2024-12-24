package model

import (
	"gorm.io/gorm"
)

type Info struct {
	gorm.Model
	Name  string `gorm:"size:255;not null;unique" json:"name"`
	Value string `gorm:"size:255;not null;" json:"value"`
}
