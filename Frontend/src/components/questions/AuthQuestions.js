import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaFilter } from "react-icons/fa";

import { fetchAuthQuestions } from "../../store/modules/questions/actions/questionsAction";
import AuthQuestion from "./AuthQuestion";
import Navigation from "../Navigation";
import "./Question.css";

const AuthQuestions = () => {
  const currentState = useSelector((state) => state.Auth);

  const questionsSelector = useSelector((state) => state.QuestionsState);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(20)
  const showMoreQuestions = () =>{
    setVisible((prevValue) => prevValue + 20);
  }

  const getAuthQuestions = (id) => dispatch(fetchAuthQuestions(id));

  useEffect(() => {
    getAuthQuestions(currentState.userId);
  }, []);

  let authQuestions = questionsSelector.authQuestions.slice(0, visible).map((question) => {
    return (
      <div className="mt-2 style-card" key={question.id}>
        <Link to={"/questions/" + question.id} key={question.id}>
          <AuthQuestion question={question} key={question.id} />
        </Link>
      </div>
    );
  });

  return (
    <div className="App">
      <div>
        <Navigation />
      </div>
      <div className="container">
        {authQuestions.length > 0 ? (
          <div className="container">{authQuestions}</div>
        ) : (
          <div className="text-center mt-4">
            <div style={{ fontSize: "100px" }}>
              <FaFilter />
            </div>
            <p className="mt-2">
              It seems you have not created any Questions yet.
            </p>
            <p>Click the button the button below to create one</p>
            <div className="mt-4">
              <Link to="/createquestion" className="btn btn-primary">
                Create Question
              </Link>
            </div>
          </div>
        )}
      </div>
      <button style={{marginTop : "20px"}} onClick={showMoreQuestions}>Load more </button>
    </div>
  );
};

export default AuthQuestions;
