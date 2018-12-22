import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  description: {
    fontStyle: 'italic',
    color: 'grey',
    fontSize: '12px',
    marginBottom: '10px',
  },
});

import {
  sendTemperatureCheck,
} from '../../ws/index.js';


class TemperatureCheckModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  state = {
    temperature: 0,
    notes: '',
  }

  handleSkip = () => {
    this.props.onClose();
  }

  handleConfirm = () => {
    sendTemperatureCheck(this.state.temperature, this.state.notes);
    this.props.onClose();
  }

  handleChangeTemperature = (evt) => {
    this.setState({
      temperature: evt.target.value,
    });
  };

  handleChangeNotes = (evt) => {
    this.setState({
      notes: evt.target.value,
    });
  };

  render() {
    const modal = (
      <div className="modal fade show in js-test-temp-check-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className={css(styles.title)}>
                Temperature check
              </div>
              <div className={css(styles.description)}>
                Use the slider below to submit your overall happiness since the
                last retrospective. Use the optional notes field to elaborate
                if you wish.
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={this.state.temperature}
              />

              <textarea
                className={css(styles.input) + ' js-test-notes-input'}
                placeholder="Optional notes"
                value={this.state.notes}
                onChange={this.handleChangeNotes}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                onClick={this.handleSkip}
              >
                Skip
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleConfirm}
              >
                Confirm
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

export default TemperatureCheckModal;
