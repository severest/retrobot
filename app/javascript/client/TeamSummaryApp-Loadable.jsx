import React from 'react';
import Loadable from 'react-loadable';
import Loader from './components/Loader/Loader.jsx';

const LoadableComponent = Loadable({
  loader: () => import('./TeamSummaryApp.jsx'),
  loading: Loader,
})

export default class LoadableTeamSummaryApp extends React.Component {
  render() {
    return <LoadableComponent {...this.props} />;
  }
}
