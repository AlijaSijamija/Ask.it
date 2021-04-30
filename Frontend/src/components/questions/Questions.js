import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Question.css";

import { fetchQuestions } from "../../store/modules/questions/actions/questionsAction";
import Question from "./Question";

const Questions = () => {
  const questionsSelector = useSelector((state) => state.QuestionsState);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(20)
  const getQuestions = () => dispatch(fetchQuestions());

  useEffect(() => {
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showMoreQuestions = () =>{
    setVisible((prevValue) => prevValue + 20);
  }
  let questions = questionsSelector.questions.slice(0, visible).map((question) => {
    return (
      <div className="mt-2 style-card" key={question.id}>
        <Link to={"/questions/" + question.id} key={question.id}>
          <Question question={question} key={question.id} />
        </Link>
      </div>
    );
  });
  return <div className="container">
    <h1 style={{textAlign:"center"}}>Questions</h1>
    {questions}
    <button style={{marginTop : "20px", marginLeft: "500px"}} onClick={showMoreQuestions}>Load more </button>
  </div>;
};

export default Questions;
