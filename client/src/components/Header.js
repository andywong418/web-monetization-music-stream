import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg header-nav">

        <div className="navbar-brand" href="/">
          <span><i className="fas fa-cubes"></i></span>
          <span> Playa</span>
        </div>
        <div className="nav nav-pills mr-2 mr-lg-0">
          <a className="nav-item nav-link" target="_blank" href="https://cml-license-generator.herokuapp.com/"> Generate a license! </a>
        </div>
    </nav>
  )
}

export default Header;
