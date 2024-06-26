import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const Login = () => {
        firestore()
            .collection('Users')
            .where('email', '==', email)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.docs[0]._data.email === email &&
                    querySnapshot.docs[0]._data.password === password) {
                    console.log('Accound Found');
                    saveLocalData(querySnapshot.docs[0]._data);
                    // navigation.navigate("HomeScreen");
                }
                else {
                    console.log('Account Not found');
                }
            }
            );
    }

    const saveLocalData = async (userData) => {
        await AsyncStorage.setItem('UserId', userData.userId);
        await AsyncStorage.setItem('Username', userData.username);
        await AsyncStorage.setItem('Email', userData.email);
        console.log("Data Stored Sucessfully");
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar hidden={true} />
            <Image className="h-[85%] w-full absolute" source={require('../../assets/images/background.png')} />

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
            <View className="h-full w-full flex justify-around pt-40 pb-10">

                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-white font-bold tracking-wider text-5xl">
                        Login
                    </Animated.Text>
                </View>

                {/* form */}

                <View className="flex items-center mx-5 space-y-4">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
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
                        entering={FadeInDown.delay(200).duration(1000).springify()}
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

                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>

                        <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3" onPress={Login}>
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="flex-row justify-center" >

                        <Text> Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('SignUpScreen')}>
                            <Text className="text-sky-600">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    )
}