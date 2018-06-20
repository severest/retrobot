import React from 'react';
import { NotificationStack } from 'react-notification';

import {
  removeNotification,
} from '../../flux/notifications/actions.js';
import notificationStore$ from '../../flux/notifications/store.js';

class Notifications extends React.Component {
  state = {
    notifications: [],
  }

  componentDidMount() {
    this.storeSubscription = notificationStore$.subscribe((state) => {
      this.setState({
        notifications: state.notifications,
      });
    });
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  render() {
    return (
      <NotificationStack
        notifications={this.state.notifications}
        onDismiss={notification => removeNotification(notification.key)}
      />
    );
  }
}

export default Notifications;
