package main

import (
	"backend/controllers"
	"backend/initializers"
	"backend/model"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"

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
	r.GET("/posts", controllers.GetAllPost)
	r.PUT("posts/:id", controllers.UpdatePost)
	r.DELETE("posts/:id", controllers.DeletePost)

	//Users
	r.POST("/users", controllers.CreateUser)
	r.POST("/login", controllers.Login)
	r.GET("/users", controllers.GetAllUsers)
	r.GET("/users/:username", controllers.GetUsers)
	r.PUT("/users/:username", controllers.UpdateUser)
	r.DELETE("/users/:username", controllers.DeleteUser)

	//votes
	r.GET("/votes", controllers.GetVotes)
	r.POST("/votes", controllers.CreateVotes)
	//Require users to be authenticated
	protected := r.Group("/try").Use(controllers.Authenticate())
	{
		protected.POST("/protected", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Protected"}) })
	}
	err := r.Run("localhost:8080")
	if err != nil {
		log.Fatal(err)
	}
}

func loadDataBase() {
	initializers.Connect()
	err := initializers.Database.AutoMigrate(&model.Post{}, &model.User{}, &model.Vote{})
	if err != nil {
		fmt.Println(err)
	}
}
