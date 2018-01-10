import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Loader from './components/Loader/Loader.jsx';
import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';
import TeamSummary from './TeamSummary.jsx';

import {
  getTeamSummary,
} from './flux/actions.js';

import store$ from './flux/store.js';

class TeamSummaryApp extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.teamName = props.match.params.team;
    this.state = {
      isLoading: false,
      error: '',
      isOffline: false,
      teamSummary: null,
    };
  }

  componentDidMount() {
    this.storeSubscription = store$.subscribe((state) => {
      this.setState({
        isLoading: state.isLoading,
        error: state.getTeamSummaryError,
        isOffline: state.isOffline,
        teamSummary: state.teamSummary,
      });
    });
    getTeamSummary({name: this.teamName});
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  getTeamSummary = () => {
    if ($(this.password).val() !== '') {
      getTeamSummary({
        name: this.teamName,
        password: $(this.password).val(),
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    }

    const passwordClasses = classNames(
      'form-group',
      {
        'has-error': this.state.error !== '',
        'has-feedback': this.state.error !== '',
      }
    )
    return (
      <div>
        {this.state.isOffline && <OfflineIndicatorModal />}
        {this.state.teamSummary === null ? (
          <div className="create-retro">
            <div className={passwordClasses}>
              <input
                type="password"
                ref={c => this.password = c}
                className="form-control"
                placeholder="Password"
              />
              {this.state.error !== '' && (
                <p className="help-block">{this.state.error}</p>
              )}
            </div>
            <button
              className="btn btn-primary create-retro-btn"
              onClick={this.getTeamSummary}
              disabled={this.state.isLoading}
            >
              Get summary
            </button>
          </div>
        ) : (
          <TeamSummary {...this.state.teamSummary} />
        )}
      </div>
    );
  }
}

export default TeamSummaryApp;
