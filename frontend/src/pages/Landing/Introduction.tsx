/* eslint-disable max-len */
import React from "react";

export const Introduction: React.FC = () => {
  return (
    <>
      <div className="aboutus">
        <img src="/image/intro.jpg" alt="" />
	    <div className="intro">项目简介</div>
	    <div className="context">
	   	  <p>
          &nbsp;&nbsp;本项目基于区块链技术，使用比特币区块链记录学历证书信息。有利于高校数字化管理证书、学生实时提供学习凭证、公司验证学历真伪，从而更好的维护教育秩序。
          </p>
	    </div>
      </div>
      <div className="chanpinshow">
	    <div className="chanpinphoto">
          <p className="step"><br/>1</p>
          <p className="step"><br/>2</p>
          <p className="step"><br/>3</p>
          <p>通过认证的学校可以颁发证书,并将其记录于区块链上，具有安全性、不可篡改性等优点，此外,学校还可以对证书进行撤回。</p>
          <p>获得证书的学生可以不必携带纸质证书,而是在需要使用时出示电子版证明即可。学生还可以在系统上登录后通过证书的哈希值从IPFS平台上获得证书。</p>
          <p>企业或任何需要认证证书有效性的第三方都可以在本网站上传并查询证书的有效性，而不需要传统的邮件、电话等方式。</p>
	    </div>
      </div>
    </>
  );
};
