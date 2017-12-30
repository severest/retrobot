import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  input: {
    resize: 'none',
    width: '100%',
    height: '150px',
    border: 'none',
    ':focus': {
      outline: 'none',
    }
  },
});

import {
  updateDeltaNotes,
} from '../../flux/actions.js';


class NotesModal extends React.Component {
  static propTypes = {
    itemId: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleTextareaChange = (ev) => {
    updateDeltaNotes({id: this.props.itemId, notes: ev.target.value});
  }

  render() {
    const modal = (
      <div className="modal fade show in" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <textarea
                className={css(styles.input)}
                placeholder="Delta notes, action items..."
                value={this.props.notes}
                onChange={this.handleTextareaChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.props.onClose}
              >
                Save and close
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(
      modal,
      document.getElementById('modal')
    )
  }
}

export default NotesModal;
