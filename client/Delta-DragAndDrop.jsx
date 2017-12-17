import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import Delta from './Delta.jsx';
import { cardTarget, cardSource, ItemTypes } from './utils/drag-drop.js';


class DeltaDragAndDrop extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  }

  render() {
    return this.props.connectDragSource(this.props.connectDropTarget(
      <div>
        <Delta {...this.props} />
      </div>
    ));
  }
}

export default DropTarget(ItemTypes.DELTA, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.DELTA, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DeltaDragAndDrop));
