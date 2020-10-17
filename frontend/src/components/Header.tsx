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
import { eciesGetJsonStringLength } from "blockstack/lib/encryption/ec";

const formInitialValue = {
  name: "",
  email: "",
  major: "",
  degree: "",
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

  const [existingState, setExistingState] =
    useState<"loading" | "registered" | "unregistered">("loading");

  const loading = existingState === "loading";

  const [data, setData] = useState(formInitialValue);

  const [submitting, setSubmitting] = useState(false);

  const loadExistingInfo = async () => {
    const resp = await fetch(getUserInfoPath(getDid()));
    if (resp.status === 404) {
      setExistingState("unregistered");
    } else {
      setExistingState("registered");
      const { name, email, major, degree } = await resp.json();
      setData({ name, email, major, degree });
    }
  };

  useEffect(() => {
    loadExistingInfo();
  }, []);

  const onSubmit = () => {
    setSubmitting(true);
    fetch(uploadInfoPath, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        did: getDid(),
        public_key: getPublicKey(),
      }),
      headers: { "content-type": "application/json" },
    })
      .then(() => {
        alert("身份绑定成功！");
        loadExistingInfo();
      })
      .finally(() => {
        setSubmitting(false);
        toggle();
      });

  };

  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>
          绑定学校身份
      </ModalHeader>
      <ModalBody>
        <p>
          在真实系统中，此步将会直接使用学校的身份认证系统确认学生身份以及下列信息。
        </p>
        <hr />
        <p>
          {
            existingState === "loading"
              ? "加载现有身份绑定信息中……"
              : existingState === "registered"
                ? "您已经绑定以下身份信息，可在下面进行修改。"
                : "您还未绑定身份信息，请填写以下信息。"
          }
        </p>
        <Form>
          <TextInput
            disabled={loading} field="name"
            data={data} setData={setData} label="姓名"
          />
          <TextInput
            disabled={loading} field="email"
            data={data} setData={setData} label="Email"
          />
          <TextInput
            disabled={loading} field="major"
            data={data} setData={setData} label="专业"
          />
          <TextInput
            disabled={loading} field="degree"
            data={data} setData={setData} label="学位"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>
          关闭
        </Button>
        <Button color="primary" onClick={onSubmit} disabled={submitting}>
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
