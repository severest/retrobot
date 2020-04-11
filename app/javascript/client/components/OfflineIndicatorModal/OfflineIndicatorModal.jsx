import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  greyedBg: {
    background: 'rgba(0,0,0,0.3)'
  },
  errorContent: {
    background: '#f00',
    color: 'white',
  },
  errorBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: '25px',
    marginRight: '10px',
  },
});

class OfflineIndicatorModal extends React.Component {
  render() {
    const modal = (
      <div className={`modal fade show in ${css(styles.greyedBg)}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className={`modal-content ${css(styles.errorContent)}`}>
            <div className={`modal-body ${css(styles.errorBody)}`}>
              <i className={`fa fa-exclamation-circle fa-inverse ${css(styles.icon)}`} aria-hidden="true" />
              You are offline
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

export default OfflineIndicatorModal;
