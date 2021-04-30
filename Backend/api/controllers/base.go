package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	//"github.com/AlijaSijamija/Ask.it/api/middlewares"
	"github.com/AlijaSijamija/Ask.it/api/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" //mysql database driver
)

type Server struct {
	DB     *gorm.DB
	Router *mux.Router
}

var errList = make(map[string]string)

func (server *Server) Initialize(Dbdriver, DbUser, DbPassword, DbPort, DbHost, DbName string) {

	var err error

	if Dbdriver == "mysql" {
		DBURL := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DbUser, DbPassword, DbHost, DbPort, DbName)
		server.DB, err = gorm.Open(Dbdriver, DBURL)
		if err != nil {
			fmt.Printf("Cannot connect to %s database", Dbdriver)
			log.Fatal("This is the error:", err)
		} else {
			fmt.Printf("We are connected to the %s database", Dbdriver)
		}
	} else {
		fmt.Println("Unknown Driver")
	}

	//database migration
	server.DB.Debug().AutoMigrate(
		&models.User{},
		&models.Question{},
		&models.Like{},
		&models.Answer{},
	)

	//server.Router = mux.NewRouter()
	//server.Router.Use(middlewares.SetupCorsResponse())
	server.initializeRoutes()
}

func (server *Server) Run(addr string) {
	log.Fatal(http.ListenAndServe(addr, server.Router))
}
