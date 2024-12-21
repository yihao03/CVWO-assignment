package controllers

import (
	"backend/initializers"
	"backend/model"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 14)
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
	if id := c.Query("user_id"); id != "" {
		//search user by id if user_id is provided
		var users model.User
		initializers.Database.Find(&users, id)
		c.JSON(200, gin.H{"users": users})
	} else {
		//return an array of all users if no user_id is provided
		var users []model.User
		initializers.Database.Find(&users)
		c.JSON(200, gin.H{"users": users})
	}

}

func UpdateUser(c *gin.Context) {
	id := c.Param("username")

	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Bio      string `json:"bio"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var users model.User
	initializers.Database.First(&users, id)
	initializers.Database.Model(&users).Updates(model.User{
		Username: body.Username,
		Password: body.Password,
		Bio:      body.Bio,
	})

	c.JSON(200, gin.H{"message": "User updated successfully"})
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
