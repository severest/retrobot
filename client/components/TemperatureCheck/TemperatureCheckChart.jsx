import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Line } from 'react-chartjs-2';

import { getAvgTemperature } from '../../utils/temperature-checks.js';
import { getTemperatureCheckSummary, defaultTemperaturCheckMonths } from '../../flux/summary/actions.js';

class TemperatureCheckChart extends React.Component {
  static propTypes = {
    teamName: PropTypes.string.isRequired,
    temperatureChecks: PropTypes.arrayOf(PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
      retroId: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired,
    })).isRequired,
  }

  constructor(props) {
    super(props);
    this.timeRangeDropdown = React.createRef();
  }

  get checksGroupedByDay() {
    return groupBy(this.props.temperatureChecks, (check) => {
      return moment(check.createdAt).format('YYYY-MM-DD');
    });
  }

  get YLabels() {
    const months = this.timeRangeDropdown.current ? this.timeRangeDropdown.current.value : defaultTemperaturCheckMonths;
    const start = moment().subtract(months, 'months');
    const labels = [];
    while (moment().isAfter(start)) {
      labels.push(start.format('YYYY-MM-DD'));
      start.add(1, 'day');
    }
    return labels;
  }

  get averageTemp() {
    if (this.props.temperatureChecks.length === 0) {
      return [];
    }
    const groupedByDay = this.checksGroupedByDay;
    return this.YLabels.map((date) => {
      if (!groupedByDay[date]) {
        return NaN;
      }
      return getAvgTemperature(groupedByDay[date]);
    });
  }

  handleTimeRangeChange = () => {
    const from = moment().subtract(this.timeRangeDropdown.current.value, 'month').format('YYYY-MM-DD')
    getTemperatureCheckSummary({name: this.props.teamName}, from);
  }

  render() {
    return (
      <div className="temperature-check-chart">
        <form role="form" className="form-inline">
           <div className="form-group">
              <select
                className="form-control"
                id="timeRange"
                ref={this.timeRangeDropdown}
                defaultValue={`${defaultTemperaturCheckMonths}`}
                onChange={this.handleTimeRangeChange}
              >
                <option value="1">1M</option>
                <option value="3">3M</option>
                <option value="6">6M</option>
                <option value="12">1Y</option>
              </select>
            </div>
        </form>
        <Line
          data={{
            labels: this.YLabels,
            datasets: [
              {
                backgroundColor: "rgb(245, 150, 8)",
                borderColor: "rgb(245, 150, 8)",
                data: this.averageTemp,
                fill: false,
                spanGaps: true,
              },
            ],
          }}
          options={{
            legend: {
              display: false,
            },
            title: {
              display: true,
              fontSize: '18',
              fontFamily: "'Open Sans', sans-serif",
              text: 'Temperature checks',
            },
            tooltips: {
              bodyFontFamily: "'Open Sans', sans-serif",
              displayColors: false,
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'month'
                }
              }],
            },
          }}
        />
      </div>
    );
  }
}

export default TemperatureCheckChart;
