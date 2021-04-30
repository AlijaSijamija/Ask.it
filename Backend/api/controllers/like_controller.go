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

func (server *Server) SaveLike(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	like := models.Like{}
	err = json.Unmarshal(body, &like)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	if uid != like.UserId {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}
	likeCreated, err := like.SaveLike(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Lacation", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, likeCreated.Id))
	responses.JSON(w, http.StatusCreated, likeCreated)
}

func (server *Server) DeleteLike(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	// Is a valid answer id given to us?
	lid, err := strconv.ParseUint(vars["id"], 10, 64)
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

	// Check if the like exist
	like := models.Like{}
	err = server.DB.Debug().Model(models.Like{}).Where("id = ?", lid).Take(&like).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Not found"))
		return
	}

	// Is the authenticated user, the owner of this like?
	if uid != like.UserId {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("You're not author of this like"))
		return
	}
	_, err = like.DeleteLike(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d", lid))
	responses.JSON(w, http.StatusNoContent, "")
}

func (server *Server) GetQuestionLikes(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	qid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	like := models.Like{}
	likes, err := like.GetLikesQuestion(server.DB, int(qid))
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, likes)
}
