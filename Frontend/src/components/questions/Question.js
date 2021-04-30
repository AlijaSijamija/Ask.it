import React from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Card, CardText, CardBody, CardTitle } from "reactstrap";

import "./Question.css";
import Likes from '../likes/Likes'
import Answers from "../answers/Answers";
import DeleteQuestion from "./DeleteQuestion";

const Question = ({ question }) => {
  const currentState = useSelector((state) => state.Auth);
  return (
    <Card className="style-card-main">
      <CardBody className="style-card-body">
        <CardTitle>
          <span style={{ fontWeight: "bold" }}>
            {question.author.name}
          </span>
          <span style={{ float: "right" }}>
            <Moment fromNow>{question.created_at}</Moment>
          </span>
        </CardTitle>
        <CardText>{question.content}</CardText>
        <div className="style-fav">
          <>
            <Likes questionsID={question.id} />
            <Answers questionID={question.id} />
          </>
          {currentState.userId === question.author_id && (
            <div className="ml-auto">
              <span style={{marginRight: "20px"}}>
                <DeleteQuestion questionID={question.id} />
              </span>
            </div>
          ) }
        </div>
      </CardBody>
    </Card>
  );
};

export default Question;
