import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../questions/Question.css";
import { fetchanswer } from "../../store/modules/answers/actions/answerAction";
import CreateAnswer from "./CreateAnswer";
import { history } from "../../history";

const Answers = ({ questionID }) => {
  const dispatch = useDispatch();

  const currentState = useSelector((state) => state);
  const currentUserState = useSelector((state) => state.Auth);
  const authID = currentUserState.userId

  const questionAnswers = currentState.AnswersState;

  const getQuestionAnswers = (id) => dispatch(fetchanswer(id));

  let singleQuestionAnswers = [];

  if (questionAnswers) {
    // eslint-disable-next-line array-callback-return
    questionAnswers.answerItems.map((eachItem) => {
      if (eachItem.questionID === questionID) {
        singleQuestionAnswers = eachItem.answers;
      }
    });
  }

  const noAuth = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  useEffect(() => {
    getQuestionAnswers(questionID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="style-heart-outer">
      <span className="mr-4">
        { authID ? 
        <span>
          <CreateAnswer questionID={questionID} />
        </span> 
         : 
         <span onClick={noAuth}>
          <CreateAnswer />
         </span>
         }
        <span className="ml-2">{singleQuestionAnswers.length}</span>
        <div></div>
      </span>
    </div>
  );
};

export default Answers;
