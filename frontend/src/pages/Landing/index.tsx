import React, { Component } from "react";
import "./Landing.css";
import { Header } from "./Header";
import { VerifyCert } from "./VerifyCert";
import { DownloadCert } from "./DownloadCert";
import { Footer } from "./Footer";
import { Introduction } from "./Introduction";

class Landing extends Component {

  render() {
    return (
      <div>
        <Header />
        <VerifyCert />
        <DownloadCert />
        <Introduction />
        <Footer />
      </div>
    );
  }
}

export default Landing;
