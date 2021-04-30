import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from "reactstrap";
import { FaPencilAlt } from "react-icons/fa";

import { updateanswer } from "../../store/modules/answers/actions/answerAction";

const EditAnswer = ({ answer, className }) => {
  const [modal, setModal] = useState(false);

  const [answerUpdate, setAnswerUpdate] = useState("");

  const dispatch = useDispatch();

  const currentState = useSelector((state) => state);

  const theUpdate = (details) => dispatch(updateanswer(details, updateSuccess));

  const updateSuccess = () => {
    setModal(!modal);
  };

  useEffect(() => {
    setAnswerUpdate(answer);
  }, [answer]);

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
    setAnswerUpdate(answer);
  };

  const handleChange = (e) => {
    setAnswerUpdate(e.target.value); //since is just one value
  };
  const submitAnswer = (e) => {
    e.preventDefault();
    theUpdate({
      id: answer.id,
      content: answerUpdate,
    });
  };

  return (
    <span>
      <FaPencilAlt className="style-edit " onClick={toggle} />

      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Edit Answer</ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Content</label>
            <textarea
              className="form-control"
              name="content"
              style={{ width: "100%", height: "100px" }}
              defaultValue={answerUpdate.content}
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
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {currentState.AnswersState.isLoading ? (
            <button className="btn btn-primary" disabled>
              Updating...
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={submitAnswer}
              type="submit"
            >
              Update
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

export default EditAnswer;
