import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  input: {
    height: '150px',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
});

import {
  updateDeltaNotes,
} from '../../flux/retro/actions.js';


class NotesModal extends React.Component {
  static propTypes = {
    itemId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    notes: '',
  }

  componentDidMount() {
    this.setState({
      notes: this.props.notes,
    });
  }

  handleTextareaChange = (evt) => {
    this.setState({
      notes: evt.target.value,
    });
    updateDeltaNotes({
      id: this.props.itemId,
      notes: evt.target.value,
      fireRequest: true
    });
  }

  render() {
    const modal = (
      <div className="modal fade show in" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className={css(styles.title)}>
                {this.props.title}
              </div>
              <textarea
                className={css(styles.input) + ' js-test-notes-input'}
                placeholder="Enter notes, action items..."
                value={this.state.notes}
                onChange={this.handleTextareaChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary js-test-save-notes"
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
