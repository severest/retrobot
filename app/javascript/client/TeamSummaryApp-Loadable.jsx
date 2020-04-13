import React from 'react';
import { lazy } from '@loadable/component';
import { Suspense } from 'react';

import Loader from './components/Loader/Loader.jsx';

const Loadable = lazy(() => import('./TeamSummaryApp.jsx'));

const TeamSummaryAppLoadable = (props) => {
  return (
    <Suspense fallback={<Loader />}>
      <Loadable {...props} />
    </Suspense>
  );
};

export default TeamSummaryAppLoadable;

