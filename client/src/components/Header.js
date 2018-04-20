import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg header-nav">

        <a className="navbar-brand" href="/">
          <span><i className="fas fa-cubes"></i></span>
          <span> Playa</span>
        </a>
        <ul className="navbar-nav mr-auto">
          <form className="form-inline my-2 my-lg-0 searchBar">
            <input className="form-control mr-sm-2 search" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-success my-2 my-sm-0" type="submit"><i className="fas fa-search"></i></button>
          </form>
        </ul>
        <div className="nav nav-pills mr-2 mr-lg-0">
          <a className="nav-item nav-link" href="#"> Productions </a>
          <a className="nav-item nav-link" href="#"> Playlists </a>
          <a className="nav-item nav-link" href="#"> About us </a>
        </div>
    </nav>
  )
}

export default Header;
