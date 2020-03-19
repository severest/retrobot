import React from 'react';
import PropTypes from 'prop-types';

import retroBotInsetLogo from '../../assets/logo-dropshadow.png';

const OpenSideMenuButton = ({
  onClick,
}) => {
  return (
    <button
      className="sidebar-menu-open"
      onClick={onClick}
    >
      <img
        src={retroBotInsetLogo}
      />
    </button>
  );
};

OpenSideMenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default OpenSideMenuButton;