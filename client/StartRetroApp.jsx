import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  createRetroError,
} from './flux/actions.js';

import store$ from './flux/store.js';

class StartRetroApp extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  state = {
    error: '',
  }

  componentDidMount() {
    store$.subscribe((state) => {
      this.setState({error: state.createRetroError});
    });
  }

  startRetroClick = () => {
    const retro = {};
    if ($(this.team).val().trim() !== '') {
      retro.team = $(this.team).val().trim();
    }
    if ($(this.password).val().trim() !== '') {
      retro.password = $(this.password).val().trim();
    }
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
        <div className="control-panel">
          <div>
            Retrobot
          </div>
        </div>

        <div className="create-retro">
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
              <span className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
            )}
            {this.state.error !== '' && (
              <p className="help-block">{this.state.error}</p>
            )}
          </div>
          <button className="btn btn-primary create-retro-btn" onClick={this.startRetroClick}>
            <i className="fa fa-play" aria-hidden="true"></i> Start retro
          </button>
        </div>
      </div>
    );
  }
}

export default StartRetroApp;
