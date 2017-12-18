import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  deletePlus,
} from '../../ws/index.js';

class Plus extends React.Component {
  static propTypes = {
    user: PropTypes.string,
    content: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }

  static defaultProps = {
    hide: false,
    user: '',
  }

  handleDelete = () => {
    deletePlus(this.props.id);
  }

  render() {
    const topClass = classNames(
      'card',
      'plus-card',
      {
        'hidden': this.props.hide,
      },
    );
    const deleteClass = classNames(
      'btn',
      'btn-link',
      'card__delete',
      {
        'hidden': window.myID !== this.props.user,
      },
    );

    return (
      <div className={topClass}>
        <div className="card__left">
          <i className="fa fa-plus" aria-hidden="true"></i>
        </div>
        <div className="card__content">
          {this.props.content}
        </div>
        <div className="card__right">
          <button
            className={deleteClass}
            onClick={this.handleDelete}
          >
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default Plus;
