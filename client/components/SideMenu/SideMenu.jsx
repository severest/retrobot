import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import retroBotInsetLogo from '../../assets/logo-dropshadow.png';

const SideMenu = ({
  children,
  onCloseMenu,
}) => {
  return (
    <div className="sidebar-menu">
      <div className="sidebar-menu--title">
        <Link to="/">
          <img
            src={retroBotInsetLogo}
          />
          Retrobot
        </Link>
      </div>

      <div className="sidebar-menu--content">
        {children}
      </div>

      <div className="sidebar-menu--content sidebar-menu--close">
        <div className="sidebar-menu--group">
          <button className="btn btn-dark" onClick={onCloseMenu}>
            <i className="fa fa-chevron-left" aria-hidden="true" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SideMenu.propTypes = {
  children: PropTypes.node,
  onCloseMenu: PropTypes.func,
};

SideMenu.defaultProps = {
  children: null,
  onCloseMenu: () => {},
};

export default SideMenu;