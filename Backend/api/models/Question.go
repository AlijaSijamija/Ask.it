package models

import (
	"errors"
	"html"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
)

type Question struct {
	Id        int       `gorm:"primary_key;auto_increment" json:"id"`
	Content   string    `gorm:"size:255;not null;" json:"content"`
	Author    User      `json:"author"`
	AuthorID  int       `gorm:"not null" json:"author_id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (q *Question) Prepare() {
	q.Id = 0
	q.Author = User{}
	q.Content = html.EscapeString(strings.TrimSpace(q.Content))
	q.CreatedAt = time.Now()
}

func (q *Question) Validate() error {
	if q.Content == "" {
		return errors.New("Required Content")
	}
	if q.AuthorID < 1 {
		return errors.New("Required Author")
	}
	return nil
}

func (q *Question) SaveQuestion(db *gorm.DB) (*Question, error) {
	var err error
	err = db.Debug().Model(&Question{}).Create(&q).Error
	if err != nil {
		return &Question{}, err
	}
	if q.Id != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", q.AuthorID).Take(&q.Author).Error
		if err != nil {
			return &Question{}, err
		}
	}
	return q, nil
}

func (q *Question) GetQuestions(db *gorm.DB) (*[]Question, error) {
	var err error
	questions := []Question{}
	err = db.Debug().Model(&Question{}).Order("created_at desc").Find(&questions).Error
	if err != nil {
		return &[]Question{}, err
	}
	if len(questions) > 0 {
		for i, _ := range questions {
			err := db.Debug().Model(&User{}).Where("id = ?", questions[i].AuthorID).Take(&questions[i].Author).Error
			if err != nil {
				return &[]Question{}, err
			}
		}
	}
	return &questions, nil
}

func (q *Question) GetQuestionById(db *gorm.DB, qid int) (*Question, error) {
	var err error
	err = db.Debug().Model(Question{}).Where("id=?", qid).Take(&q).Error
	if err != nil {
		return &Question{}, err
	}
	if q.Id != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", q.AuthorID).Take(&q.Author).Error
		if err != nil {
			return &Question{}, err
		}
	}
	return q, err
}

func (q *Question) DeleteQuestion(db *gorm.DB) (int64, error) {

	db = db.Debug().Model(&Question{}).Where("id = ?", q.Id).Take(&Question{}).Delete(&Question{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Post not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}

func (q *Question) GetUserQuestions(db *gorm.DB, uid int) (*[]Question, error) {
	questions := []Question{}
	err := db.Debug().Model(&Question{}).Where("author_id = ?", uid).Order("created_at desc").Find(&questions).Error
	if err != nil {
		return &[]Question{}, err
	}
	return &questions, err
}

//When a user is deleted, we also delete the post that the user had
func (q *Question) DeleteUserQuestions(db *gorm.DB, uid int) (int, error) {
	posts := []Question{}
	db = db.Debug().Model(&Question{}).Where("author_id = ?", uid).Find(&posts).Delete(&posts)
	if db.Error != nil {
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}
