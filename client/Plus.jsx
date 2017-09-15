import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';

import { cardTarget, cardSource, ItemTypes } from './utils/drag-drop.js';

class Plus extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    userId: PropTypes.string,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }

  static defaultProps = {
    hide: false,
    userId: '',
  }

  handleDelete = () => {
    WS.deletePlus(this.props.id);
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
        'hidden': window.myID !== this.props.userId,
      },
    );

    return this.props.connectDragSource(this.props.connectDropTarget(
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
    ));
  }
}

export default DropTarget(ItemTypes.PLUS, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.PLUS, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Plus));
