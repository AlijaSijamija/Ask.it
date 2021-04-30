package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/AlijaSijamija/Ask.it/api/auth"
	"github.com/AlijaSijamija/Ask.it/api/models"
	"github.com/AlijaSijamija/Ask.it/api/responses"
	formaterror "github.com/AlijaSijamija/Ask.it/api/utils"
	"github.com/gorilla/mux"
)

func (server *Server) CreateAnswer(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	qid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	question := models.Question{}
	err = server.DB.Debug().Model(models.Question{}).Where("id = ?", qid).Take(&question).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Not found"))
		return
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	answer := models.Answer{}
	err = json.Unmarshal(body, &answer)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	answer.Prepare()
	err = answer.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	answer.QuestionID = int(qid)
	answerCreated, err := answer.SaveAnswer(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Lacation", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, answerCreated.Id))
	responses.JSON(w, http.StatusCreated, answerCreated)
}

func (server *Server) DeleteAnswer(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	// Is a valid answer id given to us?
	aid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	// Is this user authenticated?
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	// Check if the answer exist
	answer := models.Answer{}
	err = server.DB.Debug().Model(models.Answer{}).Where("id = ?", aid).Take(&answer).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Not found"))
		return
	}

	// Is the authenticated user, the owner of this post?
	if uid != answer.AuthorID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("You're not author of this answer"))
		return
	}
	_, err = answer.DeleteAnswer(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d", aid))
	responses.JSON(w, http.StatusNoContent, "")
}

func (server *Server) UpdateAnswer(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	aid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	answer := models.Answer{}
	err = server.DB.Debug().Model(models.Answer{}).Where("id = ?", aid).Take(&answer).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Not found"))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	err = json.Unmarshal(body, &answer)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	if tokenID != answer.AuthorID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("You're not author of this answer"))
		return
	}
	answer.Prepare()
	err = answer.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	answer.Id = int(aid)
	updatedAnswer, err := answer.UpdateAnswer(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	responses.JSON(w, http.StatusOK, updatedAnswer)
}

func (server *Server) GetQuestionAnswers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	qid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	answer := models.Answer{}
	answers, err := answer.GetQuestionAnswers(server.DB, int(qid))
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, answers)
}

func (server *Server) GetUserAnswers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	answer := models.Answer{}
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	if tokenID != int(uid) {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}
	if int(uid) != answer.AuthorID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}
	answers, err := answer.GetUserAnswers(server.DB, int(uid))
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, answers)
}
