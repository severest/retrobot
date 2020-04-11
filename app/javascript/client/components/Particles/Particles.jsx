import React from 'react';
import PropTypes from 'prop-types';
import ParticlesJS from 'particlesjs';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  bg: {
    color: '#475841',
    background: '#ebebeb',
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  error: {
    width: '270px',
    height: '270px',
    margin: '50px auto',
    border: '25px solid #255F85',
    borderRadius: '50%',
    padding: '66px 0px',
    fontSize: '53px',
    color: 'white',
    background: 'rgba(37, 95, 133, 0.88)',
  },
});

class Particles extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
  }

  componentDidMount() {
    ParticlesJS.init({
      selector: '#particles',
      connectParticles: true,
      color: '#aaaaaa',
    });
  }

  render() {
    return (
      <div className={css(styles.bg, styles.fixed)}>
        <canvas id="particles" />
        <div className={css(styles.error, styles.fixed)}>{this.props.code}</div>
      </div>
    );
  }
}

export default Particles;
