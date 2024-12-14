package main

import (
	"backend/controllers"
	"backend/initializers"
	"backend/model"
	"github.com/gin-contrib/cors"
	"log"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	loadDataBase()

}
func main() {

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Access-Control-Allow-Origin"},
		AllowCredentials: true,
	}))

	loadDataBase()
	//Posts
	r.POST("/posts", controllers.Post)
	r.GET("/posts/:id", controllers.GetPost)
	r.PUT("posts/:id", controllers.UpdatePost)
	r.DELETE("posts/:id", controllers.DeletePost)

	//Users
	r.POST("/users", controllers.CreateUser)
	r.GET("/users/:username", controllers.GetUsers)
	r.PUT("/users/:username", controllers.UpdateUser)
	r.DELETE("/users/:username", controllers.DeleteUser)

	err := r.Run("localhost:8080")
	if err != nil {
		log.Fatal(err)
	}
}

func loadDataBase() {
	initializers.Connect()
	initializers.Database.AutoMigrate(&model.Entry{})
	initializers.Database.AutoMigrate(&model.User{})
}
