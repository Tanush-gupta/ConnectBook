import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Splash from './Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login';
import HomeScreen from './HomeScreen';
import SignupScreen from './SignupScreen';
import Comments from './Comments';
import Chat from './Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppNavigation() {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const checkSignIn = async () => {
            const storedUserId = await AsyncStorage.getItem('UserId');
            if (storedUserId)
                setIsSignedIn(true);
        };
        setTimeout(() => {
            checkSignIn();
        }, 1000);
    }, []);

    const Stack = createNativeStackNavigator();

    if (isSignedIn === null) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSignedIn ? (
                    <>
                        <Stack.Screen name="HomeScreen" component={HomeScreen} />
                        <Stack.Screen name="CommentScreen" component={Comments} />
                        <Stack.Screen name="ChatScreen" component={Chat} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                        <Stack.Screen name="SignUpScreen" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({});
