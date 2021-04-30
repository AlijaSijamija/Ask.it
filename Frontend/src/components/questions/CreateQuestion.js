import React, { useReducer, useState } from "react";
import {
  Label,
  Input,
  FormGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import "./Question.css";
import Navigation from "../Navigation";
import { createQuestion } from "../../store/modules/questions/actions/questionsAction";

const CreateQuestion = () => {
  const currentState = useSelector((state) => state);
  const author_id = currentState.Auth.userId;
  const [content, setContent] = useState();
  const dispatch = useDispatch();

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const submitUser = (e) => {
    e.preventDefault();
    dispatch(createQuestion({ content, author_id }));
  };

  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className="question-style container App">
        <Card className="card-style">
          <CardHeader>Create Question</CardHeader>
          <CardBody>
            <form onSubmit={submitUser}>
              <FormGroup>
                <Label>Content</Label>
                <Input
                  value={content}
                  type="textarea"
                  cols="30"
                  rows="6"
                  name="content"
                  id=""
                  placeholder="Enter a short description"
                  onChange={handleContentChange}
                />
                {currentState.QuestionsState.questionsError &&
                currentState.QuestionsState.questionsError.Required_content ? (
                  <small className="color-red">
                    {
                      currentState.QuestionsState.questionsError
                        .Required_content
                    }
                  </small>
                ) : (
                  ""
                )}
              </FormGroup>

              {currentState.QuestionsState.isLoading ? (
                <Button color="primary" type="submit" block disabled>
                  Creating...
                </Button>
              ) : (
                <Button color="primary" type="submit" block>
                  Create Question
                </Button>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateQuestion;
