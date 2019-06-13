import { Platform } from 'react-native'
import firebase from 'react-native-firebase'

const publicChannel = {
  id: 'public',
  title: 'Public',
  description: 'Public channel for everyone.',
  priority: firebase.notifications.Android.Importance.Max
}

const limitedChannel = {
  id: 'limited',
  title: 'Limited',
  description: 'Limited channel for only some subscribers.',
  priority: firebase.notifications.Android.Importance.Max
}

const channels = [publicChannel, limitedChannel]

const setAndroidChannels = () => {
  channels
    .forEach((channel) => {
      const {
        id,
        title,
        description,
        priority
      } = channel
      const androidNotificationChannel = new firebase
        .notifications
        .Android
        .Channel(id, title, priority)
        .setDescription(description)
      firebase
        .notifications()
        .android
        .createChannel(androidNotificationChannel)
    })
}

const setNotifications = () => {
  if (Platform.OS === 'android') {
    setAndroidChannels()
  }
}

export { channels, setNotifications }
