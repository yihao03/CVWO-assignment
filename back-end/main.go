package main

import (
	"backend/controllers"
	"backend/initializers"
	"backend/model"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	loadDataBase()
}

func main() {
	port := os.Getenv("PORT")
	r := gin.Default()
	r.Run(":" + port)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Access-Control-Allow-Origin"},
		AllowCredentials: true,
	}))

	loadDataBase()
	//Posts
	r.GET("/posts", controllers.GetAllPost)
	r.GET("/posts/search", controllers.SearchPost)

	//Users
	r.POST("/users", controllers.CreateUser)
	r.POST("/login", controllers.Login)
	r.GET("/users", controllers.GetUsers)
	r.DELETE("/users/:username", controllers.DeleteUser)

	//votes
	r.GET("/votes", controllers.GetVotes)

	//Require users to be authenticated
	protected := r.Group("/").Use(controllers.Authenticate())
	{
		//sample
		protected.POST("/protected", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Protected"}) })

		//Posts
		protected.POST("/posts", controllers.Post)
		protected.PUT("/posts/:id", controllers.UpdatePost)
		protected.DELETE("/posts/:id", controllers.DeletePost)

		//Users
		protected.PUT("/users/reset_password", controllers.UpdateUserPassword)
		protected.PUT("/users/reset_email", controllers.UpdateUserEmail)
		protected.PUT("/users/update_bio", controllers.UpdateBio)

		//Votes
		protected.POST("/votes", controllers.CreateVotes)
		protected.DELETE("votes", controllers.DeleteVote)
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
