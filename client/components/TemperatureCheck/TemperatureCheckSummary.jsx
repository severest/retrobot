import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Linkify from 'linkifyjs/react';

import { getAvgTemperature, getTemperatureIcon } from '../../utils/temperature-checks.js';

class TemperatureCheckSummary extends React.Component {
  static propTypes = {
    temperatureChecks: PropTypes.arrayOf(PropTypes.shape({
      notes: PropTypes.string.isRequired,
      temperature: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const averageTemp = getAvgTemperature(this.props.temperatureChecks);
    const modal = (
      <div className="modal fade show in js-test-temp-check-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className={`temp-check-summary--avg temperature-${Math.round(averageTemp)}`}>
                <i className={`fa fa-${getTemperatureIcon(averageTemp)}`} aria-hidden="true" /> {averageTemp}
              </div>
              {this.props.temperatureChecks.map((check) => (
                <div
                  key={check.userId}
                  className="temp-check-summary--item"
                >
                  <div className={`temp-check-summary--temp temperature-${Math.round(check.temperature)}`}>
                    {check.temperature}
                  </div>
                  <div className="temp-check-summary--notes">
                    <Linkify>{check.notes}</Linkify>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                onClick={this.props.onClose}
              >
                Close
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

export default TemperatureCheckSummary;
