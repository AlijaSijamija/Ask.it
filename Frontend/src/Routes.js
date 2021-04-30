import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CreateQuestion from "./components/questions/CreateQuestion";
import Dashboard from "./components/Dashboard";
import { history } from "./history";
import axios from "axios";
import Profile from "./components/users/Profile";
import Update from "./components/users/Update";
import QuestionDetails from "./components/questions/QuestionDetails";
import AuthQuestions from "./components/questions/AuthQuestions";

const Routes = () => {
  const authState = useSelector((state) => state.Auth);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authState.currentUser}`;

  return (
    <Router history={history}>
      {authState.isAuthenticated ? (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Register} />
          <Route path="/createquestion" component={CreateQuestion} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/questions/:id" component={QuestionDetails} />
          <Route path="/authquestions" component={AuthQuestions} />
          <Route path="/update" component={Update} />
          <Redirect to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Register} />
          <Route path="/questions/:id" component={QuestionDetails} />
          <Redirect to="/" />
        </Switch>
      )}
    </Router>
  );
};

export default Routes;
