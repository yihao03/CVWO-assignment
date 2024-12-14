package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"size:255;not null;unique" json:"username"`
	Email    string `gorm:"size:255;not null;unique" json:"email"`
	Password string `gorm:"size:255;not null;" json:"password"`
	Entry    []Entry
}

//func (user *User) Save() (*User, error) {
//	err := database.Database.Create(&user).Error
//	if err != nil {
//		return &User{}, err
//	}
//	return user, nil
//}
//
//func (user *User) BeforeSave(*gorm.DB) error {
//	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
//	if err != nil {
//		return err
//	}
//	user.Password = string(passwordHash)
//	user.Username = html.EscapeString(strings.TrimSpace(user.Username))
//	return nil
//}
