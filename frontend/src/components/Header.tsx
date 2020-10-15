import { useBSSession } from "src/stores/BlockstackSessionStore";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Popover,
  PopoverBody,
  Tooltip,
  Button,
} from "reactstrap";
import { copy } from "src/utils/copy";

const CopyPublicKeyLink: React.FC<{ getPublicKey: () => string }>
= ({ getPublicKey }) => {

  const handleClick = useCallback(() => {
    const key = getPublicKey();
    const result = copy(key);
    alert(result ? "复制成功！" : "复制失败！");
  }, [getPublicKey]);


  return (
    <span>
      <Button
        id="copyPublicKey"
        onClick={handleClick}
      >
        复制公钥
      </Button>
    </span>
  );
};

export const Header: React.FC = () => {

  const { session, signOut, getPublicKey } = useBSSession();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const history = useHistory();

  const handleSignOut = () => {
    signOut();
    history.push("/");
  };

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    console.log(redirectUrl);
    session.redirectToSignIn(redirectUrl);
  };

  return (
    <Navbar expand="md" dark color="blue">
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
                    <Link className="nav-link pointer" to="/dashboard">
                      个人中心
                    </Link>
                  </NavItem>
                  <NavItem>
                    <CopyPublicKeyLink getPublicKey={getPublicKey} />
                  </NavItem>
                  <NavItem>
                    <a className="nav-link pointer" onClick={handleSignOut}>
                      登出
                    </a>
                  </NavItem>
                </>

              ) : (
                <NavItem>
                  <a
                    className="nav-link pointer"
                    onClick={handleLogin}

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
