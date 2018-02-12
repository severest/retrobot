import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  deletePlus,
} from '../../ws/index.js';
import { RETRO_STATUS } from '../../utils/constants.js';

class Plus extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    content: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    retroState: PropTypes.string.isRequired,
  }

  static defaultProps = {
    hide: false,
    userId: '',
  }

  handleDelete = () => {
    deletePlus(this.props.id);
  }

  render() {
    if (this.props.hide) return null;

    const topClass = classNames(
      'card',
      'plus-card',
      'js-test-plus',
    );
    const deleteClass = classNames(
      'btn',
      'btn-link',
      'card__delete',
      {
        'hidden': window.myID !== this.props.userId,
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
          {this.props.retroState !== RETRO_STATUS.LOCKED && (
            <button
              className={deleteClass}
              onClick={this.handleDelete}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Plus;
