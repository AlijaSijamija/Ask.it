package models

import (
	"errors"
	"html"
	"log"
	"strings"
	"time"

	"github.com/badoux/checkmail"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id        int       `gorm:"primary_key;auto_increment" json:"id"`
	Name      string    `gorm:"size:100" json:"name"`
	SurName   string    `gorm:"size:100" json:"sur_name"`
	Email     string    `gorm:"size:100; not null;unique" json:"email"`
	Password  string    `gorm:"size:100; not null;" json:"password"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"create_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func Hash(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}

func VerifyPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func (u *User) BeforeSave() error {
	hashedPassword, err := Hash(u.Password)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) Prepare() {
	u.Name = html.EscapeString(strings.TrimSpace(u.Name))
	u.SurName = html.EscapeString(strings.TrimSpace(u.SurName))
	u.Email = html.EscapeString(strings.TrimSpace(u.Email))
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
}

func (u *User) Validate(action string) error {
	if action == "update" {
		if u.Password != "" && len(u.Password) < 5 {
			return errors.New("Required password with 5 or more characters")
		}
		if u.Email != "" && (checkmail.ValidateFormat(u.Email) != nil) {
			return errors.New("Required Email with Emain format")
		}
	} else {
		if u.Password == "" || len(u.Password) < 5 {
			return errors.New("Required password with 5 or more characters")
		}
		if u.Email == "" {
			return errors.New("Required Email")
		}
		if err := checkmail.ValidateFormat(u.Email); err != nil {
			return errors.New("Invalid Email")
		}
	}
	return nil
}

func (u *User) SaveUser(db *gorm.DB) (*User, error) {
	var err error
	err = db.Debug().Create(&u).Error
	if err != nil {
		return &User{}, err
	}
	return u, nil
}

func (u *User) GetUsers(db *gorm.DB) (*[]User, error) {
	var err error
	users := []User{}
	err = db.Debug().Model(&User{}).Find(&users).Error
	if err != nil {
		return &[]User{}, err
	}
	return &users, err
}

func (u *User) GetUserById(db *gorm.DB, uid int) (*User, error) {
	var err error
	err = db.Debug().Model(User{}).Where("id=?", uid).Take(&u).Error
	if err != nil {
		return &User{}, err
	}
	if gorm.IsRecordNotFoundError(err) {
		return &User{}, errors.New("User not found")
	}
	return u, err
}

func (u *User) UpdateUser(db *gorm.DB, uid int) (*User, error) {

	if u.Password != "" {
		err := u.BeforeSave()
		if err != nil {
			log.Fatal(err)
		}
		db = db.Debug().Model(&User{}).Where("id = ?", uid).Take(&User{}).UpdateColumns(
			map[string]interface{}{"password": u.Password})
	}
	if u.Email != "" {
		db = db.Debug().Model(&User{}).Where("id = ?", uid).Take(&User{}).UpdateColumns(
			map[string]interface{}{"email": u.Email})
	}
	if u.Name != "" {
		db = db.Debug().Model(&User{}).Where("id = ?", uid).Take(&User{}).UpdateColumns(
			map[string]interface{}{"name": u.Name})
	}
	if u.SurName != "" {
		db = db.Debug().Model(&User{}).Where("id = ?", uid).Take(&User{}).UpdateColumns(
			map[string]interface{}{"sur_name": u.SurName})
	}
	if db.Error != nil {
		return &User{}, db.Error
	}
	//This is the display the updated user
	err := db.Debug().Model(&User{}).Where("id = ?", uid).Take(&u).Error
	if err != nil {
		return &User{}, err
	}
	return u, nil
}

func (u *User) DeleteAUser(db *gorm.DB, uid int) (int64, error) {

	db = db.Debug().Model(&User{}).Where("id = ?", uid).Take(&User{}).Delete(&User{})

	if db.Error != nil {
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
