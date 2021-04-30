package controllers

import (
	"net/http"

	"github.com/AlijaSijamija/Ask.it/api/middlewares"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func (s *Server) initializeRoutes() {
	s.Router = mux.NewRouter()
	// Home Route
	s.Router.HandleFunc("/", middlewares.SetMiddlewareJSON(s.Home)).Methods("GET")

	// Login Route
	s.Router.HandleFunc("/login", middlewares.SetMiddlewareJSON(s.Login)).Methods("POST")

	//Users routes
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.CreateUser)).Methods("POST")
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.GetUsers)).Methods("GET")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareJSON(s.GetUser)).Methods("GET")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateUser))).Methods("PUT")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteUser)).Methods("DELETE")

	//Question routes
	s.Router.HandleFunc("/questions", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.CreateQuestion))).Methods("POST")
	s.Router.HandleFunc("/questions", middlewares.SetMiddlewareJSON(s.GetQuestions)).Methods("GET")
	s.Router.HandleFunc("/questions/{id}", middlewares.SetMiddlewareJSON(s.GetQuestion)).Methods("GET")
	s.Router.HandleFunc("/questions/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.DeleteQuestion))).Methods("DELETE")
	s.Router.HandleFunc("/questions_user/{id}", middlewares.SetMiddlewareJSON(s.GetUserQuestions)).Methods("GET")

	//Answer routes
	s.Router.HandleFunc("/answers/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.CreateAnswer))).Methods("POST")
	s.Router.HandleFunc("/answers/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteAnswer)).Methods("DELETE")
	s.Router.HandleFunc("/answers/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateAnswer))).Methods("PUT")
	s.Router.HandleFunc("/answers_question/{id}", middlewares.SetMiddlewareJSON(s.GetQuestionAnswers)).Methods("GET")
	s.Router.HandleFunc("/answers_user/{id}", middlewares.SetMiddlewareAuthentication(s.GetUserAnswers)).Methods("GET")

	//Likes routes
	s.Router.HandleFunc("/likes/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.SaveLike))).Methods("POST")
	s.Router.HandleFunc("/likes/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.DeleteLike))).Methods("DELETE")
	s.Router.HandleFunc("/likes/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.GetQuestionLikes))).Methods("GET")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})
	credentials := handlers.AllowCredentials()
	http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins, credentials)(s.Router))
}
