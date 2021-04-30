import React from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Card, CardText, CardBody, CardTitle } from "reactstrap";

import "../questions/Question.css";
import EditAnswer from "./EditAnswer";
import DeleteAnswer from "./DeleteAnswer";

const Answer = ({ answer }) => {
  const currentUserState = useSelector((state) => state.Auth);
  const authID = currentUserState.userId
  return (
    <div className="mt-3">
      <Card>
        <CardBody>
          <CardTitle>
            {answer.author ? (
              <span>
                <span href="" style={{ fontWeight: "bold" }}>
                  {answer.author.name}
                </span>
                <span style={{ float: "right" }}>
                  <Moment fromNow>{answer.created_at}</Moment>
                </span>
              </span>
            ) : (
              ""
            )}
          </CardTitle>
          <CardText>{answer.content}</CardText>
          {authID === answer.author.id ? (
            <div style={{ float: "right" }}>
              <span style={{ marginRight: "20px" }}>
                <EditAnswer answer={answer} />
              </span>
              <span>
                <DeleteAnswer answer={answer} />
              </span>
            </div>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Answer;
