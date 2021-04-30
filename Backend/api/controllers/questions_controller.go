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

func (server *Server) CreateQuestion(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	question := models.Question{}
	err = json.Unmarshal(body, &question)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	question.Prepare()
	err = question.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	//question.AuthorID = uid
	if uid != question.AuthorID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}
	questionCreated, err := question.SaveQuestion(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Lacation", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, questionCreated.Id))
	responses.JSON(w, http.StatusCreated, questionCreated)
}

func (server *Server) GetQuestions(w http.ResponseWriter, r *http.Request) {

	question := models.Question{}

	questions, err := question.GetQuestions(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, questions)
}

func (server *Server) GetQuestion(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	qid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	questions := models.Question{}

	questionReceived, err := questions.GetQuestionById(server.DB, int(qid))
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, questionReceived)
}

func (server *Server) DeleteQuestion(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	// Is a valid post id given to us?
	qid, err := strconv.ParseUint(vars["id"], 10, 64)
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

	// Check if the question exist
	question := models.Question{}
	err = server.DB.Debug().Model(models.Question{}).Where("id = ?", qid).Take(&question).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Not found"))
		return
	}

	// Is the authenticated user, the owner of this question?
	if uid != question.AuthorID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("You're not author of this question"))
		return
	}
	answer := models.Answer{}
	//like := models.Like{}

	// Also delete the likes and the comments that this post have:
	_, err = answer.DeleteQuestionAnswers(server.DB, int(qid))
	if err != nil {
		errList["Other_error"] = "Please try again later"
		w.Header().Set("Entity", fmt.Sprintf("%d", qid))
		responses.JSON(w, http.StatusNoContent, "")
		return
	}
	/*_, err = like.DeleteQuestionLikes(server.DB, int(qid))
	if err != nil {
		errList["Other_error"] = "Please try again later"
		w.Header().Set("Entity", fmt.Sprintf("%d", qid))
		responses.JSON(w, http.StatusNoContent, "")
		return
	}*/
	_, err = question.DeleteQuestion(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", qid))
	responses.JSON(w, http.StatusNoContent, "")
}

func (server *Server) GetUserQuestions(w http.ResponseWriter, r *http.Request) {
	question := models.Question{}
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	questions, err := question.GetUserQuestions(server.DB, tokenID)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, questions)
}
