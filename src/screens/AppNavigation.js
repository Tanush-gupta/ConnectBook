import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Splash from './Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login';
import HomeScreen from './HomeScreen';
import SignupScreen from './SignupScreen';
import Comments from './Comments';
import Chat from './Chat';
export default function AppNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignupScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="CommentScreen" component={Comments} />
                <Stack.Screen name="ChatScreen" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer >
    )
}

const styles = StyleSheet.create({})