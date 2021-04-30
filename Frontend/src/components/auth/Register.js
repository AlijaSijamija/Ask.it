import React, { useState } from "react";
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
import { Redirect, Link } from "react-router-dom";

import "./Auth.css";
import Navigation from "../Navigation";
import { SignUp } from "../../store/modules/auth/actions/authAction";

const Register = () => {
  const currentState = useSelector((state) => state.Auth);

  const [user, setUser] = useState({
    name: "",
    sur_name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const addUser = (credentials) => dispatch(SignUp(credentials));

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const submitUser = (e) => {
    e.preventDefault();
    addUser({
      name: user.name,
      sur_name: user.sur_name,
      email: user.email,
      password: user.password,
    });
  };

  if (currentState.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="App">
      <div>
        <Navigation />
      </div>
      <div className="container Auth">
        <Card className="card-style">
          <CardHeader>Welcome To SeamFlow</CardHeader>
          <CardBody>
            <form onSubmit={submitUser}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Surname</Label>
                <Input
                  type="text"
                  name="sur_name"
                  placeholder="Enter surname"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                />
                {currentState.signupError &&
                currentState.signupError.Required_email ? (
                  <small className="color-red">
                    {currentState.signupError.Required_email}
                  </small>
                ) : (
                  ""
                )}
                {currentState.signupError &&
                currentState.signupError.Invalid_email ? (
                  <small className="color-red">
                    {currentState.signupError.Invalid_email}
                  </small>
                ) : (
                  ""
                )}
                {currentState.signupError &&
                currentState.signupError.Taken_email ? (
                  <small className="color-red">
                    {currentState.signupError.Taken_email}
                  </small>
                ) : (
                  ""
                )}
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                />
                {currentState.signupError &&
                currentState.signupError.Required_password ? (
                  <small className="color-red">
                    {currentState.signupError.Required_password}
                  </small>
                ) : (
                  ""
                )}
                {currentState.signupError &&
                currentState.signupError.Invalid_password ? (
                  <small className="color-red">
                    {currentState.signupError.Invalid_password}
                  </small>
                ) : (
                  ""
                )}
              </FormGroup>
              {currentState.isLoading ? (
                <Button color="primary" type="submit" block disabled>
                  Registering...
                </Button>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  block
                  disabled={user.email === "" || user.password === ""}
                >
                  Register
                </Button>
              )}
            </form>
            <div className="mt-2">
              <small>
                Have an account? <Link to="/login">Please login</Link>
              </small>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Register;
