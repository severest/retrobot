import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';
import _reverse from 'lodash/reverse';
import _sortBy from 'lodash/sortBy';
import _every from 'lodash/every';
import Linkify from 'linkifyjs/react';

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
    wordBreak: 'break-word',
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
      deltaGroups: PropTypes.array.isRequired,
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
                {_reverse(_sortBy(retro.deltas, [(delta) => {
                  const group = retro.deltaGroups.find((g) => g.deltas.includes(delta.id));
                  const votes = group ? group.deltas.reduce((arr, groupDeltaId) => {
                    const groupDelta = retro.deltas.find(del => del.id === groupDeltaId);
                    if (groupDelta) {
                      return arr.concat(groupDelta.votes);
                    }
                    return arr;
                  }, []) : delta.votes;
                  return votes.length;
                }, 'id']))
                .map((delta) => {
                  const group = retro.deltaGroups.find((g) => g.deltas.includes(delta.id));
                  const votes = group ? group.deltas.reduce((arr, groupDeltaId) => {
                    const groupDelta = retro.deltas.find(del => del.id === groupDeltaId);
                    if (groupDelta) {
                      return arr.concat(groupDelta.votes);
                    }
                    return arr;
                  }, []) : delta.votes;
                  const notes = group ? group.deltas.reduce((notesArray, groupDeltaId) => {
                    const groupDelta = retro.deltas.find(del => del.id === groupDeltaId);
                    if (groupDelta && groupDelta.notes && groupDelta.notes !== '') {
                      return notesArray.concat(groupDelta.notes);
                    }
                    return notesArray;
                  }, []) : [delta.notes];
                  const content = group ? group.deltas.reduce((contentArray, groupDeltaId) => {
                    const groupDelta = retro.deltas.find(del => del.id === groupDeltaId);
                    if (groupDelta) {
                      return contentArray.concat(groupDelta.content);
                    }
                    return contentArray;
                  }, []) : [delta.content];
                  return {
                    ...delta,
                    hide: (group && group.deltas[0] !== delta.id),
                    votes,
                    notes,
                    content,
                  };
                })
                .map((delta) => {
                  if (_every(delta.notes, (notes) => !notes || notes === '') || delta.hide) {
                    return null;
                  }
                  return (
                    <div
                      key={delta.id}
                      className={css(styles.delta)}
                    >
                      {delta.content.map((content) => (
                        <div
                          key={content}
                          className={`${css(styles.deltaContent)}
                          js-test-delta-summary-content`}
                        >
                          {content}
                        </div>
                      ))}
                      <div className={`${css(styles.votes)} js-test-delta-summary-votes`}>{delta.votes.length} {delta.votes.length === 1 ? 'vote' : 'votes'}</div>

                      {delta.notes.map((notes) => {
                        if (!notes || notes === '') {
                          return null;
                        }
                        return (
                          <div key={notes} className={css(styles.notes)}>
                            <Linkify>{notes}</Linkify>
                          </div>
                        );
                      })}
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
