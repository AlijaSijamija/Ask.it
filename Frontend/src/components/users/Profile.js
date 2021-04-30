import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import {
  FormGroup, Button, CardBody, Col, Row, Modal, ModalHeader, ModalFooter, ModalBody, 
} from "reactstrap";
import {
  deleteUser, getUser,
} from "../../store/modules/auth/actions/authAction";
import "./Profile.css";

import Navigation from "../Navigation";

const Profile = () => {
  const [modal, setModal] = useState(false);

  const toggle = (e) => setModal(!modal);

  const dispatch = useDispatch();

  const currentUserState = useSelector((state) => state.Auth);

  useEffect(() => {
    dispatch(getUser(currentUserState.userId));
  }, []);

  const deleteAccount = (id) => dispatch(deleteUser(id));

  const shutDown = (e) => {
    e.preventDefault();
    deleteAccount(currentUserState.userId);
  };

  return (
    <Fragment>
      <Navigation />
      <div className="post-style container">
        <div className="card-style">
          <div className="text-center">
            <h4>Profile</h4>
          </div>
          <CardBody>
            <Row>
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <div style={{ margin: "10px 0px 10px" }}>
                  Name:<strong>{currentUserState.userData.name}</strong>
                </div>
              </Col>
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <div style={{ margin: "10px 0px 10px" }}>
                  Surname: <strong>{currentUserState.userData.sur_name}</strong>
                </div>
              </Col>
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <div style={{ margin: "10px 0px 10px" }}>
                  Email: <strong>{currentUserState.userData.email}</strong>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <FormGroup>
                  <NavLink to="../update">
                    <Button color="primary" block>
                      Edit profile
                    </Button>
                  </NavLink>
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="12" md={{ size: 10, offset: 1 }}>
                <FormGroup>
                  <Button onClick={toggle} color="danger" type="submit" block>
                    Delete Account
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>

          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} className="text-center">
              Are you sure you want to delete your account?
            </ModalHeader>
            <ModalBody toggle={toggle} className="text-center">
              This will also delete your posts, likes and comments if you
              created any.
            </ModalBody>
            <ModalFooter>
              {currentUserState.isLoading ? (
                <button className="btn btn-danger" disabled>
                  Deleting...
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={shutDown}
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
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
