import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const translateKeyframes = {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
};

const styles = StyleSheet.create({
  loader: {
    borderRadius: '50%',
    color: '#6f7072',
    fontSize: '11px',
    textIndent: '-99999em',
    margin: '55px auto',
    position: 'relative',
    width: '10em',
    height: '10em',
    boxShadow: 'inset 0 0 0 1em',
    transform: 'translateZ(0)',
    ':after': {
      position: 'absolute',
      content: '""',
      width: '5.2em',
      height: '10.2em',
      background: '#ebebeb',
      borderRadius: '0 10.2em 10.2em 0',
      top: '-0.1em',
      left: '5.1em',
      transformOrigin: '0px 5.1em',
      animationName: [translateKeyframes],
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease',
    },
    ':before': {
      position: 'absolute',
      content: '""',
      width: '5.2em',
      height: '10.2em',
      background: '#ebebeb',
      borderRadius: '10.2em 0 0 10.2em',
      top: '-0.1em',
      left: '-0.1em',
      transformOrigin: '5.2em 5.1em',
      animationName: [translateKeyframes],
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease',
      animationDelay: '1.5s',
    }
  }
});


const Loader = () => {
  return (
    <div className={css(styles.loader)}>Loading</div>
  );
};

export default Loader;
