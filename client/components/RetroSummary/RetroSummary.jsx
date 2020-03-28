import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import _reverse from 'lodash/reverse';
import _sortBy from 'lodash/sortBy';
import _every from 'lodash/every';
import Linkify from 'linkifyjs/react';

import { getAvgTemperature, getTemperatureIcon } from '../../utils/temperature-checks';

class RetroSummary extends React.Component {
  static propTypes = {
    retro: PropTypes.shape({
      key: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      deltaGroups: PropTypes.array.isRequired,
      deltas: PropTypes.array.isRequired,
      includeTemperatureCheck: PropTypes.bool.isRequired,
      temperatureChecks: PropTypes.arrayOf(PropTypes.shape({
        temperature: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
  }

  render() {
    const { retro } = this.props;
    const avgTemperature = getAvgTemperature(retro.temperatureChecks);
    return (
      <div className="retro-summary">
        <div className="retro-summary__heading">
          <Link to={`/retro/${retro.key}`}>
            {moment(retro.createdAt).format('MMMM D, YYYY')}
          </Link>
          {retro.includeTemperatureCheck && `${avgTemperature}`}
          <div>
            <span className="fa-stack">
              <i className={`fa fa-${getTemperatureIcon(avgTemperature)} fa-stack-2x`}></i>
              {!retro.includeTemperatureCheck && <i className="fa fa-ban fa-stack-2x text-danger"></i>}
            </span>
          </div>
        </div>

        <div className="retro-summary__deltas">
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
                className="retro-summary__delta"
              >
                {delta.content.map((content) => (
                  <div
                    key={content}
                    className="retro-summary__delta-content js-test-delta-summary-content"
                  >
                    {content}
                  </div>
                ))}
                <div className="retro-summary__votes js-test-delta-summary-votes">{delta.votes.length} {delta.votes.length === 1 ? 'vote' : 'votes'}</div>

                {delta.notes.map((notes) => {
                  if (!notes || notes === '') {
                    return null;
                  }
                  return (
                    <div key={notes} className="retro-summary__notes">
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
  }
}

export default RetroSummary;
