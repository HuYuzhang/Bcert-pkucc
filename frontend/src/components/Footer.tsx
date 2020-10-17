import React from "react";
import { Col, Container, Row } from "reactstrap";
import "./Footer.css";

export const Footer: React.FC = () => {
  return (
    <Container className="footer" fluid>
      <Row>
        <Col md={4} className="footer-item">
          © All Rights Reserved
        </Col>
        <Col md={4} className="footer-item">
          基于区块链的教育信息验证系统
        </Col>
        <Col md={4} className="footer-item">
          时旻 毕业设计
        </Col>
      </Row>
    </Container>
  );
};
