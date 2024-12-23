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
	front_end := os.Getenv("FRONTEND_URL")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for local development
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", front_end},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
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
	err := r.Run("localhost:" + port)
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
