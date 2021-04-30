import React, { useEffect } from "react";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardText, CardBody, CardTitle } from "reactstrap";

import { fetchQuestion } from "../../store/modules/questions/actions/questionsAction";
import Navigation from "../Navigation";
import Likes from '../likes/Likes'
import Answers from "../answers/Answers";
import Answer from "../answers/Answer";
import DeleteQuestion from "./DeleteQuestion";

const QuestionDetails = (props) => {
  const questionID = props.match.params.id;

  const dispatch = useDispatch();

  const singleQuestion = (id) => dispatch(fetchQuestion(id));

  const currentState = useSelector((state) => state);

  const currentUserState = useSelector((state) => state.Auth);

  const question = currentState.QuestionsState.question;

  const questionAnswers = currentState.AnswersState;

  const authID = currentUserState.userId
  

  useEffect(() => {
    singleQuestion(questionID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let singleQuestionAnswers = [];

  if (questionAnswers) {
    // eslint-disable-next-line array-callback-return
    questionAnswers.answerItems.map((eachItem) => {
      if (eachItem.questionID === questionID) {
        singleQuestionAnswers = eachItem.answers;
      }
    });
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        <div className="mt-5 style-card">
          <Card>
            <CardBody style={{ paddingBottom: "0px" }}>
              <CardTitle>
                <span>
                  <span href="" style={{ fontWeight: "bold" }}>
                    {question.author ? question.author.name : ""}
                  </span>
                </span>
                <span style={{ float: "right" }}>
                  <Moment fromNow>{question ? question.created_at : ""}</Moment>
                </span>
              </CardTitle>
              <CardText>{question.content}</CardText>
              <div className="style-fav">
                <Likes questionsID={questionID} />
                <Answers questionID={questionID} />
                {authID === question.author_id && (
                  <div className="ml-auto">
                    <span>
                      <DeleteQuestion questionID={question.id} />
                    </span>
                  </div>
                )} 
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-3 style-card-answer">
          {singleQuestionAnswers.length > 0
            ? singleQuestionAnswers.map((answer) => {
                return <Answer answer={answer} key={answer.id} />;
              })
            : ""}
        </div> 
      </div>
    </div>
  );
};

export default QuestionDetails;
