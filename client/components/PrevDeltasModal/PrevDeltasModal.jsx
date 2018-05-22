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
  deltaItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  deltaItemCheck: {
    margin: '0',
  },
  deltaItemText: {
    marginLeft: '10px',
  },
});

import {
  sendDelta,
} from '../../ws/index.js';


class PrevDeltasModal extends React.Component {
  static propTypes = {
    prevDeltas: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    selected: [],
  }

  handleSkip = () => {
    this.props.onClose();
  }

  handleConfirm = () => {
    this.props.prevDeltas.filter(d => this.state.selected.includes(d.id)).forEach((delta) => {
      sendDelta(delta.content, window.myID);
    });
    this.props.onClose();
  }

  handleCheckbox = (deltaId) => {
    if (this.state.selected.includes(deltaId)) {
      this.setState({
        selected: this.state.selected.filter(s => s !== deltaId),
      });
    } else {
      this.setState({
        selected: this.state.selected.concat(deltaId),
      });
    }
  };

  render() {
    const modal = (
      <div className="modal fade show in js-test-prev-deltas-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className={css(styles.title)}>
                Deltas from previous retro
              </div>
              <div className={css(styles.description)}>
                Below is a list of deltas you created that were not discussed last time.
                Select items to have them readded to this one.
              </div>

              {this.props.prevDeltas.map((delta) => {
                return (
                  <div
                    key={delta.id}
                    className={css(styles.deltaItem)}
                  >
                    <input
                      className={css(styles.deltaItemCheck) + ' js-test-prev-delta-check'}
                      type="checkbox"
                      selected={this.state.selected.includes(delta.id)}
                      onClick={() => this.handleCheckbox(delta.id)}
                    />
                    <div className={css(styles.deltaItemText)}>
                      {delta.content}
                    </div>
                  </div>
                );
              })}
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
                Add these deltas
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

export default PrevDeltasModal;
