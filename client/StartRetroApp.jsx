import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';

import {
  createRetroError,
  isLoading,
  doneLoading,
} from './flux/actions.js';

import store$ from './flux/store.js';

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
    if ($(this.team).val().trim() !== '') {
      retro.team = $(this.team).val().trim();
    }
    if ($(this.password).val() !== '') {
      retro.password = $(this.password).val();
    }
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
    });
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
              />
              {this.state.error !== '' && (
                <p className="help-block">{this.state.error}</p>
              )}
            </div>
            <button
              className="btn btn-primary create-retro-btn"
              type="submit"
              disabled={this.state.isLoading}
            >
              <i className="fa fa-play" aria-hidden="true"></i> Start retro
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default StartRetroApp;
