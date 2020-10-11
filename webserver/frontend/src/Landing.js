import React, { Component,useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserSession } from 'blockstack'
import { appConfig } from './constants'
import Dropzone from 'react-dropzone'
import './Landing.css'
import axios from 'axios'
//513

//const ipfsClient = require('ipfs-http-client')
//const ipfs = ipfsClient('http://localhost:5001')

const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

function Utf8ArrayToStr(array) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = array.length;
	i = 0;
	while(i < len) {
		c = array[i++];
		switch(c >> 4)
		{
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c);
			break;
			case 12: case 13:
			// 110x xxxx 10xx xxxx
			char2 = array[i++];
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
			case 14:
			// 1110 xxxx 10xx xxxx 10xx xxxx
			char2 = array[i++];
			char3 = array[i++];
			out += String.fromCharCode(((c & 0x0F) << 12) |((char2 & 0x3F) << 6) |((char3 & 0x3F) << 0));
            break;
		default:
			break;
		}
	}
	return out;
}


class Landing extends Component {

  constructor() {
    super()
    this.userSession = new UserSession({ appConfig })
        this.state = {
            url:'',
			hash:'',
			arr : [],
			base64 :[]
	}
        this.handleVerify=this.handleVerify.bind(this)
        //this.handleDownload=this.handleDownload.bind(this)
  }


handleVerify(){
  console.log("start to redirect to verify")
  let  url="http://127.0.0.1:3000/verify?url="+this.state.url
  axios.get(url)
  .then(function (response) {
    let data =response.data
    alert(data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

  urlChanged=(e)=>{
    const newVal=e.target.value
    this.setState({
       url:newVal
    })
  }

  hashChanged=(e)=>{
    const newVal=e.target.value
    this.setState({
       hash:newVal
    })
  }

  signIn(e) {
    e.preventDefault()
    this.userSession.redirectToSignIn()
  }


  render() {
    return (

<div>
	<nav className="navbar navbar-expand-md navbar-dark bg-blue fixed-top">
	<Link className="navbar-brand" to="/">PKU Cert Centre</Link>
	<div className="collapse navbar-collapse" id="navbarsExampleDefault">
	  <ul className="navbar-nav mr-auto">
	    <li className="nav-item">
	      <Link className="nav-link" to="/">网站首页</Link>
	    </li>
	    <li className="nav-item">
	      <Link className="nav-link" to="/">验证证书</Link>
	    </li>
	    <li className="nav-item">
             <Link className="nav-link" to="/" onClick={this.signIn.bind(this)}>个人主页</Link>
	    </li>
	    <li className="nav-item">
	      <Link className="nav-link" to="/">关于我们</Link>
	    </li>
	  </ul>
	</div>

	</nav>

	<div className="banner">
	  <div className="search">
			<div className="first">
				<span className="pas">输入需要验证的证书URL</span>
		  </div>


			<div className="second">
				<div className="back">
					{/* <input type="text" name="id" value={this.state.url} onChange={(e) => this.urlChanged(e)} className="number"/>
				<input type="submit" onClick={this.handleVerify} value="验证"  className="ok"/>          */}
				
        <form action="http://127.0.0.1:3000/upload" method="post" enctype="multipart/form-data">
                   
                    <input type="file" name='file' className="upload"/>
                      {/* <a href="javascript:;" class="aTest">
                      <input type="file" name="" id="" />选择需要上传的文件
                      </a> */}
                      <input type="submit" value="验证" className="ok"/>
                   
                </form>

				</div>
			</div>
			
			
		</div>
	</div>







	<div className="ipfs">
          <div className="ipfscentre">
	    <div className="ipfsleft">
                <p className="ipfstitle">证书原件下载</p>
                <p className="ipfsexplain">本系统中所有的证书在颁发时均已上传至IPFS系统，并将其哈希值随pdf文件一并发送至证书持有者邮箱。若证书丢失或损毁，在右侧输入证书的哈希值即可在IPFS平台下载证书原件。</p>
            </div>
            <div className="ipfsright">
                <input type="text" name="hash" value={this.state.hash} onChange={(e) => this.hashChanged(e)} className="number"/>
                <form method="get" action={"http://127.0.0.1:8080/ipfs/"+this.state.hash}>
                    <button className="ok" type="submit">下载</button>
                </form>
	        {/*<input type="submit" onClick={this.handleDownload} value="验证"  className="ok"/>*/}             
	    </div>
          </div>
	</div>

	<div className="aboutus">
            <img src="intro.jpg" alt="" />
	    <div className="intro">项目简介</div>
	    <div className="context">
	   	  <p> &nbsp;&nbsp;本项目基于区块链技术，使用比特币区块链记录学历证书信息。有利于高校数字化管理证书、学生实时提供学习凭证、公司验证学历真伪，从而更好的维护教育秩序。</p>
	    </div>
	    <div className="more"><a className="menu-link" href="http://127.0.0.1:9090/" target="_self">more</a></div> 
	</div>

	<div className="show">
	    <div className="chanpinphoto">
			<p className="step"><br/>1</p>
			<p className="step"><br/>2</p>
			<p className="step"><br/>3</p>
		<p>通过认证的学校可以颁发证书,并将其记录于区块链上，具有安全性、不可篡改性等优点，此外,学校还可以对证书进行撤回。</p>
		<p>获得证书的学生可以不必携带纸质证书,而是在需要使用时出示电子版证明即可。也可以通过证书的哈希值在IPFS平台上获得证书。</p>
		<p>企业或任何需要认证证书有效性的第三方都可以在本网站上传并查询证书的有效性，而不需要传统的邮件、电话等方式。</p>
	    </div>
	</div>

	<div className="bottom">
	    <ul className="down">
		<li>© All Rights Reserved </li>
		<li>基于区块链的教育信息验证系统 </li>
		<li>时旻 毕业设计</li>
	    </ul>
	</div>
</div>
    );
  }
}

export default Landing