import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Splash from './Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login';
import HomeScreen from './HomeScreen';
import SignupScreen from './SignupScreen';
export default function AppNavigation() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignupScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer >
    )
}

const styles = StyleSheet.create({})