import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

import TemperatureCheckChart from './components/TemperatureCheck/TemperatureCheckChart.jsx';
import RetroSummary from './components/RetroSummary/RetroSummary.jsx';

const styles = StyleSheet.create({
  header: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  empty: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#a7a7a7',
  },
});

class TeamSummary extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    retros: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      deltaGroups: PropTypes.array.isRequired,
      deltas: PropTypes.array.isRequired,
      includeTemperatureCheck: PropTypes.bool.isRequired,
    })).isRequired,
    temperatureChecks: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="team-summary__container">
        <div className={css(styles.header)}>{this.props.name}</div>

        {this.props.retros.length === 0 ? (
          <div className={css(styles.empty)}>
            <i className="fa fa-times fa-2x" aria-hidden="true"></i>
            <div>No Retros</div>
          </div>
        ) : (
          <React.Fragment>
            <TemperatureCheckChart
              teamName={this.props.name}
              temperatureChecks={this.props.temperatureChecks}
            />

            {this.props.retros.map((retro) => (
              <RetroSummary
                key={retro.key}
                retro={retro}
              />
            ))}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default TeamSummary;
