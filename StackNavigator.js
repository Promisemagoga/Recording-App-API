import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Jonurnal from './pages/journal'
import Recordings from './pages/recordings'
import Login from './pages/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import Register from './pages/Register'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator()
function StackNavigator() {


  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log(user);
  //       const uid = user.uid
  //       console.log(uid);
  //       setIsAuthenticated(true)
  //       navigation.navigate("Home")
  //     } else {
  //       setIsAuthenticated(null)
  //     }
  //   })
  // }, [isAuthenticated])

  
  const checkAuthentication = async () => {
    // const idToken = auth.currentUser.getIdToken()
    const isAuthenticated = await AsyncStorage.getItem('user')
    
    console.log("true",isAuthenticated);
    return isAuthenticated === 'true';
    
  }

  const isAuthenticated = checkAuthentication()
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Home' component={Jonurnal} />
          <Stack.Screen name='Recordings' component={Recordings} />
        </Stack.Group>
      ) : (
        <>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Register' component={Register} />
        </>
      )
      }
    </Stack.Navigator>
  )
}

export default StackNavigator