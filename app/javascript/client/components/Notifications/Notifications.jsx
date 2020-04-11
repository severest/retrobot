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
        notifications={this.state.notifications.map((n) => ({
          ...n,
          barStyle: {
            color: 'black',
            background: 'white',
            borderLeft: '5px solid orange',
            borderRadius: '0 4px 4px 0',
            padding: '8px 12px',
            boxShadow: '0 0 10px black',
            maxWidth: '375px',
          },
        }))}
        onDismiss={notification => removeNotification(notification.key)}
      />
    );
  }
}

export default Notifications;
