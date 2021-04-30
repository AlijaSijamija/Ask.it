import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { Label, Input, FormGroup, Button, Col, Row, Form } from "reactstrap";
import { updateUser } from "../../store/modules/auth/actions/authAction";
import "./Profile.css";
import Message from "../utils/Message";
import Navigation from "../Navigation";

const Update = () => {
  const currentUserState = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState(currentUserState.userData.email);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const [name, setName] = useState(currentUserState.userData.name);
  const handleChangeName = (e) => setName(e.target.value);
  const [sur_name, setSurname] = useState(currentUserState.userData.sur_name);
  const handleChangeSurname = (e) => setSurname(e.target.value);

  const submitUser = (e) => {
    e.preventDefault();
    dispatch(
      updateUser(currentUserState.userData.id, { email, name, sur_name })
    );
  };

  return (
    <Fragment>
      <Navigation />
      <Form onSubmit={submitUser}>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <FormGroup>
              <Label for="exampleAddress">Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleChangeEmail}
              />
              {currentUserState.userError &&
              currentUserState.userError.Required_email ? (
                <small className="color-red">
                  {currentUserState.userError.Required_email}
                </small>
              ) : (
                ""
              )}
              {currentUserState.userError &&
              currentUserState.userError.Invalid_email ? (
                <small className="color-red">
                  {currentUserState.userError.Invalid_email}
                </small>
              ) : (
                ""
              )}
              {currentUserState.userError &&
              currentUserState.userError.Taken_email ? (
                <small className="color-red">
                  {currentUserState.userError.Taken_email}
                </small>
              ) : (
                ""
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <FormGroup>
              <Label for="exampleAddress">Name</Label>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={handleChangeName}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <FormGroup>
              <Label for="exampleAddress">Surname</Label>
              <Input
                type="text"
                name="sur_name"
                value={sur_name}
                onChange={handleChangeSurname}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <FormGroup>
              {currentUserState.authSuccessUser != null &&
              currentUserState.userError == null ? (
                <Message msg={currentUserState.authSuccessUser} />
              ) : (
                ""
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <FormGroup>
              {currentUserState.isUpdatingUser ? (
                <Button color="primary" type="submit" block disabled>
                  Updating...
                </Button>
              ) : (
                <Button color="primary" type="submit" block>
                  Update
                </Button>
              )}
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};
export default Update;
