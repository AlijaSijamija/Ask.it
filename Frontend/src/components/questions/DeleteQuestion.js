import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalFooter } from "reactstrap";
import { FaRegTrashAlt } from "react-icons/fa";

import { deleteQuestion } from "../../store/modules/questions/actions/questionsAction";

const DeleteQuestion = ({ questionID, className }) => {
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const currentState = useSelector((state) => state);

  const removeQuestion = (id) => dispatch(deleteQuestion(id));

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  };

  const submitDelete = (e) => {
    e.preventDefault();
    let id = questionID;
    removeQuestion(id);
  };

  return (
    <span>
      <FaRegTrashAlt className="style-delete" onClick={toggle} />

      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle} className="text-center">
          Delete Question?
        </ModalHeader>
        <ModalFooter>
          {currentState.AnswersState.isLoading ? (
            <button className="btn btn-primary" disabled>
              Deleting...
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={submitDelete}
              type="submit"
            >
              Delete
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

export default DeleteQuestion;
