package controllers

import (
	"backend/initializers"
	"backend/model"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreateUser(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	user := model.User{
		Username: body.Username,
		Email:    body.Email,
		Password: string(hashedPassword),
	}

	result := initializers.Database.Create(&user)

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, gin.H{"message": "User created successfully"})
	}
}

func GetUsers(c *gin.Context) {
	id := c.Query("user_id")
	search := c.Query("search")

	if id != "" {
		//search user by id if user_id is provided
		var users model.User
		initializers.Database.Find(&users, id)
		c.JSON(200, gin.H{"users": users})
	} else {
		var users []model.User

		if search != "" {
			initializers.Database.Where("username LIKE ?", "%"+search+"%").Find(&users)
			c.JSON(200, gin.H{"users": users})
		} else {
			//return an array of all users if no user_id is provided
			initializers.Database.Find(&users)
			c.JSON(200, gin.H{"users": users})
		}
	}

}

func UpdateUserPassword(c *gin.Context) {

	var body struct {
		ID          uint   `json:"user_id"`
		Password    string `json:"password"`
		NewPassword string `json:"new_password"`
	}

	//bind the request body to the body struct
	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user model.User
	check := initializers.Database.First(&user, body.ID)

	if errors.Is(check.Error, gorm.ErrRecordNotFound) {
		//return 404 if user is not found
		c.JSON(404, gin.H{"error": "User not found"})
		return
	} else if check.Error != nil {
		//return 500 if there is an error
		c.JSON(500, gin.H{"error": check.Error})
		return
	} else if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		//return 401 if the password is invalid
		c.JSON(401, gin.H{"error": "Invalid password"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)

	result := initializers.Database.Model(&user).Update("password", user.Password)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"message": "Password updated successfully"})
}

func UpdateUserEmail(c *gin.Context) {
	var body struct {
		ID    uint   `json:"user_id"`
		Email string `json:"email"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user model.User
	check := initializers.Database.First(&user, body.ID)

	if errors.Is(check.Error, gorm.ErrRecordNotFound) {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	} else if check.Error != nil {
		c.JSON(500, gin.H{"error": check.Error})
		return
	}

	initializers.Database.Model(&user).Update("email", body.Email)

	c.JSON(200, gin.H{"message": "Email updated successfully"})
}

func UpdateBio(c *gin.Context) {
	var body struct {
		ID  uint   `json:"user_id"`
		Bio string `json:"bio"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user model.User
	check := initializers.Database.First(&user, body.ID)

	if errors.Is(check.Error, gorm.ErrRecordNotFound) {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	} else if check.Error != nil {
		c.JSON(500, gin.H{"error": check.Error})
		return
	}

	initializers.Database.Model(&user).Update("bio", body.Bio)

	c.JSON(200, gin.H{"message": "Bio updated successfully"})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("username")
	var users model.User
	initializers.Database.First(&users, id)
	initializers.Database.Delete(&users)
	c.JSON(200, gin.H{"message": "User deleted successfully"})
}

var jwtKey = []byte("SECRET_KEY")

func Login(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	var user model.User
	if err := initializers.Database.Where("username = ?", body.Username).First(&user).Error; err != nil {
		fmt.Println("user not found")
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid password"})
		return
	}

	claims := jwt.MapClaims{
		"userID":   user.ID,
		"username": user.Username,
		"admin":    user.Admin,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(200, gin.H{"token": tokenString, "user_id": user.ID, "username": user.Username})
}

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(403, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
