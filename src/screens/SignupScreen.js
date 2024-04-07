import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function SignupScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    let userId = uuid.v4();
    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    const saveData = () => {

        firestore()
            .collection('Users')
            .where('email', '==', email)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    console.log('Accound Already Exist');
                    showToastWithGravity("Account Already Exist");
                }
                else {
                    firestore()
                        .collection('Users')
                        .doc(userId)
                        .set({
                            username: username,
                            email: email,
                            password: password,
                            userId: userId,
                            followers: [],
                            following: [],
                            bio: "",
                            posts: [],
                            profilePicture: "",
                        })
                        .then(() => {
                            console.log('User added!');
                        });
                    showToastWithGravity("User added!");
                    setTimeout(() => {
                        navigation.navigate('LoginScreen');
                    }, 800)
                }
            }
            );
    }
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background.png')} />

            {/* lights */}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    source={require('../../assets/images/light.png')}
                    className="h-[225] w-[90]"
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    source={require('../../assets/images/light.png')}
                    className="h-[160] w-[65] opacity-75"
                />
            </View>

            {/* title and form */}
            <View className="h-full w-full flex justify-around pt-48">

                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-white font-bold tracking-wider text-5xl">
                        Sign Up
                    </Animated.Text>
                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={'gray'}

                            onChangeText={(e) => {
                                setUsername(e);
                            }}
                            value={username}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={'gray'}

                            onChangeText={(e) => {
                                setEmail(e);
                            }}
                            value={email}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            onChangeText={(e) => {
                                setPassword(e);
                            }}
                            value={password}
                        />
                    </Animated.View>

                    <Animated.View className="w-full" entering={FadeInDown.delay(600).duration(1000).springify()}>
                        <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3" onPress={saveData}>
                            <Text className="text-xl font-bold text-white text-center">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center">

                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                            <Text className="text-sky-600">Login</Text>
                        </TouchableOpacity>

                    </Animated.View>
                </View>
            </View>
        </View>
    )
}