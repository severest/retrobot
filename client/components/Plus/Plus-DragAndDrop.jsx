import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import Plus from './Plus.jsx';
import { cardTarget, cardSource, ItemTypes } from '../../utils/drag-drop.js';

class PlusDragAndDrop extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  }

  render() {
    return this.props.connectDragSource(this.props.connectDropTarget(
      <div>
        <Plus {...this.props} />
      </div>
    ));
  }
}

export default DropTarget(ItemTypes.PLUS, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.PLUS, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(PlusDragAndDrop));
