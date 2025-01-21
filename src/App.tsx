import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ChatScreen from './screens/ChatScreen'

const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView />
      <ChatScreen />
    </View>
  )
}

export default App