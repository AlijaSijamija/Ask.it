package models

import (
	"errors"
	"html"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
)

type Answer struct {
	Id         int       `gorm:"primary_key;auto_increment" json:"id"`
	Content    string    `gorm:"size:255;not null;" json:"content"`
	Author     User      `json:"author"`
	AuthorID   int       `gorm:"not null" json:"author_id"`
	Question   Question  `json:"question"`
	QuestionID int       `gorm:"not null" json:"question_id"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (a *Answer) Prepare() {
	a.Id = 0
	a.Author = User{}
	a.Content = html.EscapeString(strings.TrimSpace(a.Content))
	a.Question = Question{}
	a.UpdatedAt = time.Now()
	a.CreatedAt = time.Now()
}

func (a *Answer) Validate() error {
	if a.Content == "" {
		return errors.New("Required Content")
	}
	if a.AuthorID == 0 {
		return errors.New("Required Author")
	}
	if a.QuestionID == 0 {
		return errors.New("Required question")
	}
	return nil
}

func (a *Answer) SaveAnswer(db *gorm.DB) (*Answer, error) {
	var err error
	err = db.Debug().Model(&Answer{}).Create(&a).Error
	if err != nil {
		return &Answer{}, err
	}
	if a.Id != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", a.AuthorID).Take(&a.Author).Error
		if err != nil {
			return &Answer{}, err
		}
		err = db.Debug().Model(&Question{}).Where("id = ?", a.QuestionID).Take(&a.Question).Error
		if err != nil {
			return &Answer{}, err
		}
	}
	return a, nil
}

func (a *Answer) GetQuestionAnswers(db *gorm.DB, qid int) (*[]Answer, error) {

	answers := []Answer{}
	err := db.Debug().Model(&Answer{}).Where("question_id = ?", qid).Order("created_at desc").Find(&answers).Error
	if err != nil {
		return &[]Answer{}, err
	}
	if len(answers) > 0 {
		for i, _ := range answers {
			err := db.Debug().Model(&User{}).Where("id = ?", answers[i].AuthorID).Take(&answers[i].Author).Error
			if err != nil {
				return &[]Answer{}, err
			}
		}
		for i, _ := range answers {
			err := db.Debug().Model(&Question{}).Where("id = ?", answers[i].QuestionID).Take(&answers[i].Question).Error
			if err != nil {
				return &[]Answer{}, err
			}
		}
	}
	return &answers, err
}

func (a *Answer) GetUserAnswers(db *gorm.DB, uid int) (*[]Answer, error) {

	answers := []Answer{}
	err := db.Debug().Model(&Answer{}).Where("user_id = ?", uid).Order("created_at desc").Find(&answers).Error
	if err != nil {
		return &[]Answer{}, err
	}
	if len(answers) > 0 {
		for i, _ := range answers {
			err := db.Debug().Model(&Question{}).Where("id = ?", answers[i].QuestionID).Take(&answers[i].Question).Error
			if err != nil {
				return &[]Answer{}, err
			}
		}
	}
	return &answers, err
}

func (a *Answer) DeleteAnswer(db *gorm.DB) (int, error) {

	db = db.Debug().Model(&Answer{}).Where("id = ?", a.Id).Take(&Answer{}).Delete(&Answer{})

	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Answer not found")
		}
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}

func (a *Answer) UpdateAnswer(db *gorm.DB) (*Answer, error) {

	var err error

	err = db.Debug().Model(&Answer{}).Where("id = ?", a.Id).Updates(Answer{Content: a.Content, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Answer{}, err
	}
	if a.Id != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", a.AuthorID).Take(&a.Author).Error
		if err != nil {
			return &Answer{}, err
		}
		err = db.Debug().Model(&Question{}).Where("id = ?", a.QuestionID).Take(&a.Question).Error
		if err != nil {
			return &Answer{}, err
		}
	}
	return a, nil
}

//When a user is deleted, we also delete the comments that the user had
func (a *Answer) DeleteUserAnswers(db *gorm.DB, uid int) (int, error) {
	answers := []Answer{}
	db = db.Debug().Model(&Answer{}).Where("author_id = ?", uid).Find(&answers).Delete(&answers)
	if db.Error != nil {
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}

//When a post is deleted, we also delete the answers that the post had
func (a *Answer) DeleteQuestionAnswers(db *gorm.DB, qid int) (int, error) {
	answers := []Answer{}
	db = db.Debug().Model(&Answer{}).Where("question_id = ?", qid).Find(&answers).Delete(&answers)
	if db.Error != nil {
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}
