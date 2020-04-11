import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Loader from './components/Loader/Loader.jsx';
import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';
import SideMenu from './components/SideMenu/SideMenu.jsx';
import TeamSummary from './TeamSummary.jsx';

import {
  getTeamSummary,
  getRetros,
} from './flux/summary/actions.js';

import store$ from './flux/summary/store.js';

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
      page: 1,
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

  handleSubmitGetSummaryForm = (evt) => {
    evt.preventDefault();
    if (this.password.value !== '') {
      getTeamSummary({
        name: this.teamName,
        password: this.password.value,
      });
    }
  }

  getNextPage = () => {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      getRetros({name: this.teamName}, this.state.page);
    })
  }

  render() {
    const passwordClasses = classNames(
      'form-group',
      {
        'has-error': this.state.error !== '',
        'has-feedback': this.state.error !== '',
      }
    )
    return (
      <div className="team-summary">
        {this.state.isOffline && <OfflineIndicatorModal />}
        {!this.state.teamSummary || this.state.teamSummary.name === undefined ? (
          <React.Fragment>
            {this.state.isLoading ? <Loader /> : (
              <div className="create-retro">
                <form role="form" onSubmit={this.handleSubmitGetSummaryForm}>
                  <div className={passwordClasses}>
                    <input
                      type="password"
                      ref={c => this.password = c}
                      className="form-control"
                      placeholder="Password"
                    />
                    {this.state.error !== '' && (
                      <p className="help-block help-block--error">{this.state.error}</p>
                    )}
                  </div>
                  <button
                    className="btn btn-primary create-retro-btn"
                    type="submit"
                    disabled={this.state.isLoading}
                  >
                    Get summary
                  </button>
                </form>
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="team-summary-left">
              <SideMenu />
            </div>
            <div className="team-summary-right">
              <TeamSummary {...this.state.teamSummary} />
              {this.state.isLoading && <Loader />}
              {!this.state.isLoading && this.state.teamSummary.retros.length < this.state.teamSummary.totalRetros && (
                <div className="team-summary__load-more">
                  <button
                    className="btn btn-default"
                    onClick={this.getNextPage}
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default TeamSummaryApp;
