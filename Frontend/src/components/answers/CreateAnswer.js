import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaRegComment } from "react-icons/fa";

import { createAnswer } from "../../store/modules/answers/actions/answerAction";

const CreateAnswer = ({ questionID, className }) => {
  const [modal, setModal] = useState(false);
  const [content, setBody] = useState("");

  const dispatch = useDispatch();

  const currentState = useSelector((state) => state);
  const currentUserState = useSelector((state) => state.Auth);

  const addAnswer = (details) => dispatch(createAnswer(details, answerSuccess));

  const answerSuccess = () => {
    setModal(!modal);
  };

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const submitAnswer = (e) => {
    e.preventDefault();
    addAnswer({
      question_id: Number(questionID),
      author_id: currentUserState.userId,
      content,
    });
  };

  return (
    <span>
      <FaRegComment className="style-heart " onClick={toggle} />

      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Answer</ModalHeader>
        <ModalBody>
          <textarea
            name="content"
            style={{ width: "100%", height: "150px" }}
            onChange={handleChange}
          ></textarea>
          {currentState.AnswersState.answersError &&
          currentState.AnswersState.answersError.Required_body ? (
            <small className="color-red">
              {currentState.AnswersState.answersError.Required_body}
            </small>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          {currentState.AnswersState.isLoading ? (
            <button className="btn btn-primary" disabled>
              Saving...
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={submitAnswer}
              type="submit"
            >
              Answer
            </button>
          )}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

export default CreateAnswer;
