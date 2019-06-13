import React from 'react'
import firebase from 'react-native-firebase'
import { AsyncStorage, StyleSheet, Platform, Image, Linking, Text, TouchableOpacity, View, ScrollView } from 'react-native'

import { channels, setNotifications } from './notifications'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      subscriptions: []
    }
  }

  componentDidMount() {
    this.setupDeepLinking()
    this.setupNotifications()
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleDeepLinkEvent)
  }

  setupNotifications = async () => {
    const { messages } = this.state
    setNotifications()
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(({ notification }) => {
        console.log('notification opened', notification)
        console.log(notification.data, notification.notificationId)
        this.setState({ messages: [...messages, notification] })
        this.parseDeepLink(notification.data.url)
      })
    this.handleInitialNotification()
  }

  handleInitialNotification = async () => {
    const event = await firebase.notifications().getInitialNotification()
    if (event && event.notification && event.notification.data) {
      console.log('got initial notification', event.notification)
    }
  }

  toggleSubscription = (id) => {
    const { subscriptions } = this.state
    if (subscriptions.includes(id)) {
      firebase
        .messaging()
        .unsubscribeFromTopic(id)
      this.setState({ subscriptions: subscriptions.filter((s) => s !== id) })
    } else {
      firebase
        .messaging()
        .subscribeToTopic(id)
      this.setState({ subscriptions: [...subscriptions, id] })
    }
  }

  setupDeepLinking = () => {
    Linking.addEventListener('url', this.handleDeepLinkEvent)
    Linking
      .getInitialURL()
      .then((url) => {
        this.parseDeepLink(url)
      })
  }

  handleDeepLinkEvent = (event) => {
    this.parseDeepLink(event.url)
  }

  parseDeepLink = (url) => {
    console.log(url || 'no deep link')
  }

  render() {
    const { messages, subscriptions } = this.state
    console.log('msg', messages)
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]} />
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>
          <Text style={styles.instructions}>
            To test push notifications, send them using the Firebase console. When you open a notification, its message should be visible here.
          </Text>
          {channels.map((channel) => (
            <TouchableOpacity style={styles.button} key={channel.id} onPress={() => { this.toggleSubscription(channel.id) }}>
              <Text>{subscriptions.includes(channel.id) ? 'Unsubscribe from' : 'Subscribe to'} {channel.id}</Text>
            </TouchableOpacity>
          ))}
          {firebase.notifications.nativeModuleExists
            ? <Text style={styles.module}>Notifications enabled.</Text>
            : <Text style={styles.module}>Notifications NOT enabled.</Text>
          }
          {messages.map((m) => <Text key={m.notificationId}>{m.notificationId}</Text>)}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderWidth: 2,
    borderColor: '#454545',
    margin: 4
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
})

export default App
