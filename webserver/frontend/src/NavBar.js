import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

class NavBar extends Component {

  render() {
    const username = this.props.username
    return (
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
      <Link className="nav-link" to={`/kingdom/${username}`}>个人主页</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/">关于我们</Link>
    </li>
  </ul>
</div>
<ul className="navbar-nav mr-auto">
  <li className="nav-item">
    <Link className="nav-link" to='/'>{username}</Link>
  </li>
</ul>
<button
  className="btn btn-primary"
  onClick={this.props.signOut.bind(this)}
>Sign out
</button>
</nav>
)
}
}

export default NavBar
