import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

const MIN_DELTAS_SHOWN = 4;
const styles = StyleSheet.create({
  container: {
    padding: '30px 0',
    width: '900px',
    margin: 'auto',
  },
  header: {
    fontSize: '24px',
  },
  subHeader: {
    fontSize: '11px',
    color: 'grey',
  },
  retro: {
    marginTop: '10px',
    borderBottom: '2px solid #c3c3c3',
  },
  deltas: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  delta: {
    width: '410px',
    borderRadius: '4px',
    background: '#f9f9f9',
    padding: '10px',
    flexShrink: '0',
    margin: '20px',
  },
  deltaContent: {
    fontWeight: 'bold',
    fontSize: '15px',
  },
  votes: {
    background: '#c00',
    color: 'white',
    borderRadius: '15px',
    padding: '5px 8px',
    display: 'inline-block',
    margin: '3px 0',
  },
  notes: {
    whiteSpace: 'pre-line',
    marginTop: '10px',
  },
  emptyNotes: {
    fontStyle: 'italic',
    marginTop: '10px',
  },
});

class TeamSummary extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    retros: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      deltas: PropTypes.array.isRequired,
    })).isRequired,
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>{this.props.name}</div>
        <div className={css(styles.subHeader)}>Retrobot</div>

        {this.props.retros.map((retro) => {
          return (
            <div
              key={retro.key}
              className={css(styles.retro)}
            >
              <div>
                <Link to={`/retro/${retro.key}`}>
                  Retro from {moment(retro.createdAt).format('MMMM D, YYYY')}
                </Link>
              </div>
              <div className={css(styles.deltas)}>
                {retro.deltas.map((delta, deltaIndex) => {
                  if ((deltaIndex + 1) > MIN_DELTAS_SHOWN && (!delta.notes || delta.notes === '')) {
                    return null;
                  }
                  return (
                    <div
                      key={delta.id}
                      className={css(styles.delta)}
                    >
                      <div className={css(styles.deltaContent)}>{delta.content}</div>
                      <div className={css(styles.votes)}>{delta.votes} votes</div>
                      {!delta.notes || delta.notes === '' ? (
                        <div className={css(styles.emptyNotes)}>No action items</div>
                      ) : (
                        <div className={css(styles.notes)}>{delta.notes}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TeamSummary;
