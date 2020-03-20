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
  input: {
    resize: 'none',
    width: '100%',
    height: '50px',
    border: 'none',
    ':focus': {
      outline: 'none',
    },
    marginTop: '10px',
  },
  sliderValue: {
    textAlign: 'center',
    width: '100%',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
  },
  slider: {
    margin: '0 15px',
  },
  sliderLabel: {
    width: '20px',
  },
  sliderLabelRight: {
    textAlign: 'right',
  },
});

import {
  sendTemperatureCheck,
} from '../../ws/index.js';


class TemperatureCheckModal extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    temperatureCheck: PropTypes.shape({
      notes: PropTypes.string.isRequired,
      temperature: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
    }),
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    temperatureCheck: null,
  }

  constructor(props) {
    super(props);
    if (props.temperatureCheck) {
      this.state = {
        ...props.temperatureCheck
      };
    } else {
      this.state = {
        temperature: 5,
        notes: '',
      };
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.temperatureCheck && this.props.temperatureCheck) {
      this.setState({
        ...this.props.temperatureCheck,
      });
    }
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

  handleChangeTemperatureNotes = (evt) => {
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

              <div className={`${css(styles.sliderValue)} temperature-${this.state.temperature}`}>
                {this.state.temperature}
              </div>

              <div className={css(styles.sliderContainer)}>
                <div className={css(styles.sliderLabel)}>0</div>
                <input
                  className={css(styles.slider)}
                  type="range"
                  min="0"
                  max="10"
                  value={this.state.temperature}
                  onChange={this.handleChangeTemperature}
                />
                <div className={css(styles.sliderLabel, styles.sliderLabelRight)}>10</div>
              </div>

              <textarea
                className={css(styles.input) + ' js-test-temperature-notes-input'}
                placeholder="Optional notes"
                value={this.state.notes}
                onChange={this.handleChangeTemperatureNotes}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                onClick={this.props.onClose}
              >
                Skip
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleConfirm}
                disabled={this.props.disabled}
              >
                Submit temperature check
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
