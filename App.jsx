import { NavigationContainer, StackRouter } from '@react-navigation/native'
import React from 'react'
import Welcome from './src/components/Welcome/index.jsx'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'
import Login from './src/components/Login/index.jsx'
import SignUp from './src/components/SignUp/index.jsx'

const Stack = createStackNavigator()

enableScreens()

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component = {Welcome} />
        <Stack.Screen name="Login" component = {Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App