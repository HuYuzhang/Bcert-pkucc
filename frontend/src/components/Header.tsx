import { useBSSession } from "src/stores/BlockstackSessionStore";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  FormGroup,
  Label,
  ModalFooter,
} from "reactstrap";
import { getUserInfoPath, uploadInfoPath } from "src/api";

const formInitialValue = {
  username: "",
  password: "",
};

type TFormData = {[key in keyof typeof formInitialValue]: string };

const TextInput: React.FC<{
  field: string;
  data: TFormData;
  setData: (d: TFormData) => void;
  label: string;
  disabled?: boolean;
}> = ({ field, setData, label, data, disabled }) => {
  return (
    <FormGroup>
      <Label for={field}>
        {label}
      </Label>
      <Input
        id={field}
        type="text"
        value={data[field]}
        onChange={(e) => setData({ ...data, [field]: e.target.value })}
        disabled={disabled}
      />
    </FormGroup>
  );
};

const InfoModal: React.FC<{
  open: boolean;
  toggle: () => void;
  getPublicKey: () => string;
  getDid: () => string;
}> = ({ open, toggle, getPublicKey, getDid  }) => {

  const [data, setData] = useState(formInitialValue);

  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>
          绑定学校身份
      </ModalHeader>
      <ModalBody>
        <p>
          登录学校身份后，系统将会自动获得学生的ID和学历信息。
        </p>
        <hr />
        <Form>
          <TextInput
            field="username"
            data={data} setData={setData} label="学校账号"
          />
          <TextInput
            field="password"
            data={data} setData={setData} label="学校密码"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>
          关闭
        </Button>
        <Button color="primary" onClick={toggle}>
          绑定
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const CopyPublicKeyLink: React.FC<{
  getPublicKey: () => string;
  getDid: () => string;
}>
= ({ getPublicKey, getDid }) => {

  const [open, setOpen] = useState(false);


  return (
    <span>
      <Button
        id="copyPublicKey"
        onClick={() => setOpen(true)}
      >
        绑定学校身份
      </Button>
      <InfoModal
        open={open}
        toggle={() => setOpen((o) => !o)}
        getPublicKey={getPublicKey}
        getDid={getDid}
      />
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
                    <CopyPublicKeyLink
                      getPublicKey={getPublicKey}
                      getDid={() => session.loadUserData().username}
                    />
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
