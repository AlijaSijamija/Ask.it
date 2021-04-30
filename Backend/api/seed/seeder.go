package seed

import (
	"log"

	"github.com/AlijaSijamija/Ask.it/api/models"
	"github.com/jinzhu/gorm"
)

var users = []models.User{
	models.User{
		Name:     "Alija",
		SurName:  "Sijamija",
		Email:    "alija@gmail.com",
		Password: "sijamija",
	},
	models.User{
		Name:     "martin",
		SurName:  "Luther",
		Email:    "luther@example.com",
		Password: "luther",
	},
}

var questions = []models.Question{
	models.Question{
		Content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
	},
	models.Question{
		Content: "Tako je",
	},
}

func Load(db *gorm.DB) {

	err := db.Debug().DropTableIfExists(&models.Question{}, &models.User{}, &models.Like{}, &models.Answer{}).Error
	if err != nil {
		log.Fatalf("cannot drop table: %v", err)
	}
	err = db.Debug().AutoMigrate(&models.User{}, &models.Question{}, &models.Answer{}, &models.Like{}).Error
	if err != nil {
		log.Fatalf("cannot migrate table: %v", err)
	}

	err = db.Debug().Model(&models.Question{}).AddForeignKey("author_id", "users(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	err = db.Debug().Model(&models.Answer{}).AddForeignKey("author_id", "users(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	err = db.Debug().Model(&models.Answer{}).AddForeignKey("question_id", "questions(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	err = db.Debug().Model(&models.Like{}).AddForeignKey("user_id", "users(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	err = db.Debug().Model(&models.Like{}).AddForeignKey("question_id", "questions(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	for i, _ := range users {
		err = db.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
		questions[i].AuthorID = users[i].Id

		err = db.Debug().Model(&models.Question{}).Create(&questions[i]).Error
		if err != nil {
			log.Fatalf("cannot seed posts table: %v", err)
		}
	}
}
