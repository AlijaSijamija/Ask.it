package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
)

type Like struct {
	Id         int       `gorm:"primary_key;auto_increment" json:"id"`
	UserId     int       `gorm:"not null" json:"user_id"`
	QuestionId int       `gorm:"not null" json:"question_id"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (l *Like) SaveLike(db *gorm.DB) (*Like, error) {

	// Check if the auth user has liked this post before:
	err := db.Debug().Model(&Like{}).Where("question_id = ? AND user_id = ?", l.QuestionId, l.UserId).Take(&l).Error
	if err != nil {
		if err.Error() == "record not found" {
			// The user has not liked this post before, so lets save incomming like:
			err = db.Debug().Model(&Like{}).Create(&l).Error
			if err != nil {
				return &Like{}, err
			}
		}
	} else {
		// The user has liked it before, so create a custom error message
		err = errors.New("double like")
		return &Like{}, err
	}
	return l, nil
}

func (l *Like) DeleteLike(db *gorm.DB) (*Like, error) {
	var err error
	var deletedLike *Like

	err = db.Debug().Model(Like{}).Where("id = ?", l.Id).Take(&l).Error
	if err != nil {
		return &Like{}, err
	} else {
		//If the like exist, save it in deleted like and delete it
		deletedLike = l
		db = db.Debug().Model(&Like{}).Where("id = ?", l.Id).Take(&Like{}).Delete(&Like{})
		if db.Error != nil {
			fmt.Println("cant delete like: ", db.Error)
			return &Like{}, db.Error
		}
	}
	return deletedLike, nil
}

func (l *Like) GetLikesQuestion(db *gorm.DB, qid int) (*[]Like, error) {

	likes := []Like{}
	err := db.Debug().Model(&Like{}).Where("question_id = ?", qid).Find(&likes).Error
	if err != nil {
		return &[]Like{}, err
	}
	return &likes, err
}

//When a user is deleted, we also delete the likes that the user had
func (l *Like) DeleteUserLikes(db *gorm.DB, uid int) (int, error) {
	likes := []Like{}
	db = db.Debug().Model(&Like{}).Where("user_id = ?", uid).Find(&likes).Delete(&likes)
	if db.Error != nil {
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}

//When a post is deleted, we also delete the likes that the post had
func (l *Like) DeleteQuestionLikes(db *gorm.DB, qid int) (int, error) {
	likes := []Like{}
	db = db.Debug().Model(&Like{}).Where("question_id = ?", qid).Find(&likes).Delete(&likes)
	if db.Error != nil {
		return 0, db.Error
	}
	return int(db.RowsAffected), nil
}
