import React from 'react';
import Loadable from 'react-loadable';
import Loader from './components/Loader/Loader.jsx';

const LoadableComponent = Loadable({
  loader: () => import('./RetroBoardApp.jsx'),
  loading: Loader,
})

export default class LoadableRetroBoardApp extends React.Component {
  render() {
    return <LoadableComponent {...this.props} />;
  }
}
