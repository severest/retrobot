import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';

import {
  createRetroError,
  isLoading,
  doneLoading,
} from './flux/retro/actions.js';

import store$ from './flux/retro/store.js';

class StartRetroApp extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    isLoading: false,
    error: '',
    isOffline: false,
  }

  componentDidMount() {
    this.storeSubscription = store$.subscribe((state) => {
      this.setState({
        isLoading: state.isLoading,
        error: state.createRetroError,
        isOffline: state.isOffline,
      });
    });
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  startRetroClick = (evt) => {
    evt.preventDefault();
    const retro = {
      creator: window.myID,
    };
    if (this.team.value.trim() !== '') {
      retro.team = this.team.value.trim();
    }
    if (this.password.value !== '') {
      retro.password = this.password.value;
    }
    retro.max_votes = this.maxVotes.value;
    retro.time_limit = this.timeLimit.value;
    isLoading();
    fetch('/api/retro/new', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({retro}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((retro) => {
      if (retro.error) {
        doneLoading();
        createRetroError(retro.error);
      } else {
        this.props.history.push(`/retro/${retro.key}`);
      }
    }).catch(() => {
      doneLoading();
      createRetroError('There was an unknown error, please try again.')
    });
  }

  render() {
    const unknownRegex = /unknown/;
    const passwordClasses = classNames(
      'form-group',
      {
        'has-error': this.state.error !== '' && !unknownRegex.test(this.state.error),
        'has-feedback': this.state.error !== '' && !unknownRegex.test(this.state.error),
      }
    )
    return (
      <div>
        {this.state.isOffline && <OfflineIndicatorModal />}
        <div className="create-retro">
          <form role="form" onSubmit={this.startRetroClick}>
            <div className="form-group">
              <input
                type="text"
                ref={c => this.team = c}
                className="form-control"
                placeholder="Team name (optional)"
              />
            </div>
            <div className={passwordClasses}>
              <input
                type="password"
                ref={c => this.password = c}
                className="form-control"
                placeholder="Password (optional)"
                autoComplete="current-password"
              />
              {this.state.error !== '' && (
                <p className="help-block">{this.state.error}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="maxVotes">Max votes</label>
              <select
                className="form-control"
                id="maxVotes"
                ref={c => this.maxVotes = c}
                defaultValue="2"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="timeLimit">Time limit (minutes)</label>
              <select
                className="form-control"
                id="timeLimit"
                ref={c => this.timeLimit = c}
                defaultValue="5"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </div>
            <button
              className="btn btn-primary create-retro-btn"
              type="submit"
              disabled={this.state.isLoading}
            >
              <i className="fa fa-play" aria-hidden="true" /> Start retro
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default StartRetroApp;
