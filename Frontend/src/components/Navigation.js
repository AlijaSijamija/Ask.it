import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SignOut } from "../store/modules/auth/actions/authAction";
import "./Navigation.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const Navigation = () => {
  const authState = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(SignOut());
  };

  const userProfile =
    authState.isAuthenticated && `/profile/${authState.userId}`;

  const SignedInLinks = (
    <React.Fragment>
      <NavItem className="mt-2" style={{ marginRight: "15px" }}>
        <NavLink to="/createquestion">Create question</NavLink>
      </NavItem>
      <NavItem className="mt-2" style={{ marginRight: "15px" }}>
        <NavLink to="/authquestions">My questions</NavLink>
      </NavItem>
      <NavItem className="mt-2" style={{ marginRight: "15px" }}>
        <NavLink to={userProfile}>Profile</NavLink>
      </NavItem>
      <NavItem className="mt-2" style={{ marginRight: "15px" }}>
        <Link style={{ cursor: "pointer" }} onClick={logout}>
          Logout
        </Link>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownMenu right>
          <DropdownItem>
            <NavItem>
              <NavLink to={userProfile}>Profile</NavLink>
            </NavItem>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <Link onClick={logout}>Logout</Link>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );

  const SignedOutLinks = (
    <React.Fragment>
      <NavItem style={{ marginRight: "20px" }}>
        <Link to="/login">Login</Link>
      </NavItem>
      <NavItem>
        <Link to="/signup">Signup</Link>
      </NavItem>
    </React.Fragment>
  );

  return (
    <div className="mb-3">
      <Navbar color="light" light expand="md">
        <NavbarBrand className="mx-auto">
          <Link to="/">Ask.it</Link>
        </NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {authState.isAuthenticated ? SignedInLinks : SignedOutLinks}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
