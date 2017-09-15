import { updateOrder } from '../flux/actions.js';

export const ItemTypes = {
  DELTA: 'delta',
  PLUS: 'plus',
};

export const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      type: props.type,
      index: props.index,
    };
  },
};

export const cardTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    updateOrder({
      dragIndex,
      hoverIndex,
      type: monitor.getItem().type,
    });
  },
};
