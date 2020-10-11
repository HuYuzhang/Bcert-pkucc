import { useBSSession } from "src/stores/BlockstackSessionStore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";

export const Header: React.FC = () => {

  const { session, signOut } = useBSSession();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="md" dark color="blue" fixed="top">
      <NavbarBrand>
        <Link className="navbar-brand" to="/">
          PKU Cert Centre
        </Link>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar className="justify-content-between">
        <Nav navbar>
          <NavItem>
            <Link className="nav-link" to="/">网站首页</Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/">关于我们</Link>
          </NavItem>
        </Nav>
        <Nav navbar>
          {
            session.isUserSignedIn()
              ? (
                <>
                  <NavItem>
                    <a className="nav-link pointer">
                      {session.loadUserData().username}
                    </a>
                  </NavItem>
                  <NavItem>
                    <a className="nav-link pointer" onClick={signOut}>
                      登出
                    </a>
                  </NavItem>
                </>

              ) : (
                <NavItem>
                  <a
                    className="nav-link pointer"
                    onClick={() => session.redirectToSignIn()}
                  >
                    使用BlockStack ID登录
                  </a>
                </NavItem>
              )
          }
        </Nav>
      </Collapse>
    </Navbar>
  );
};
