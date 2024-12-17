package initializers

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB //created outside to make it global.

// make sure your function start with uppercase to call outside of the directory.
func Connect() {

	err := godotenv.Load() //by default, it is .env so we don't have to write
	if err != nil {
		fmt.Println("Error is occurred  on .env file please check")
	}
	//we read our .env file
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")
	user := os.Getenv("USER")
	dbname := os.Getenv("DB_NAME")
	pass := os.Getenv("PASSWORD")

	// set up postgres sql to open it.
	psqlSetup := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		host, port, user, dbname, pass)
	db, errSql := gorm.Open(postgres.Open(psqlSetup), &gorm.Config{})
	if errSql != nil {
		fmt.Println("There is an error while connecting to the database ", err)
		panic(err)
	} else {
		Database = db
		fmt.Println("Successfully connected to database!")
	}
}