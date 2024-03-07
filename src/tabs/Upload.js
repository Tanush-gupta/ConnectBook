import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import uuid from 'react-native-uuid';
export default function Upload() {
    const [imgData, setImg] = useState(null);
    const [caption, setCaption] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState();
    let postId = uuid.v4();

    useEffect(() => {
        getUserDetails();
    }, [])

    const getUserDetails = async () => {
        const storedUsername = await AsyncStorage.getItem('Username');
        const storedEmail = await AsyncStorage.getItem('Email');
        const storedUserId = await AsyncStorage.getItem('UserId');
        setUsername(storedUsername);
        setEmail(storedEmail);
        setUserId(storedUserId);
    }


    const Galery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            setImg(result);
        }
    }
    const Camera = async () => {
        const result = await launchCamera({ mediaType: 'photo' });
        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            setImg(result);
        }
        console.log(imgData);
    }

    const Post = async () => {

        if (imgData?.assets?.length > 0) {
            const reference = storage().ref(imgData.assets[0].fileName);
            const pathToFile = imgData.assets[0].uri;
            await reference.putFile(pathToFile);
            const url = await storage().ref(imgData.assets[0].fileName).getDownloadURL();

            firestore()
                .collection('Post')
                .doc(postId).set({
                    url: url,
                    caption: caption,
                    email: email,
                    username: username,
                    userid: userId,
                    post_id: postId,
                    likes: [],
                    comments: []
                })
                .then(() => {
                    console.log('Post added!');
                    setImg(null);
                    setCaption();
                });



        }
    }


    return (
        <>
            <View className="flex h-full justify-between pb-20">
                <View className=" justify-center items-center p-3  bg-white " style={{ borderBottomColor: 'grey', borderBottomWidth: 0.4, display: 'flex' }}>
                    <Text className="font-semibold text-black">Create a new Post</Text>
                </View>

                <View className="justify-betweeen items-center bg-blue-100 flex p-6 mx-6 rounded-xl " style={styles.shadow}>

                    <View >
                        {imgData != null ? (<Image className=" rounded-xl" style={{ width: 300, height: 300, resizeMode: 'cover', }} source={{ uri: imgData.assets[0].uri }} />) : (<Image style={styles.img} source={require('../../assets/images/img.jpg')} />)}
                    </View>

                    {imgData != null && (
                        <View className="justify-center items-center">
                            <TextInput value={caption} onChangeText={(e) => {
                                setCaption(e);
                            }} className="bg-white p-4 m-4 rounded-2xl w-80 }" placeholder='Enter the caption....' ></TextInput>

                            <TouchableOpacity className="p-3 bg-green-500 rounded-2xl w-20" style={styles.shadow} onPress={Post}>
                                <Text className="text-white font-semibold">Upload</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                </View>



                <View className="flex-row justify-center ">
                    <TouchableOpacity className="p-3 bg-blue-500 rounded-2xl elevated mr-8" style={styles.shadow} onPress={Camera} >
                        <Text className="text-white font-semibold">Open Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-3 bg-red-500 rounded-2xl" style={styles.shadow} onPress={Galery}>
                        <Text className="text-white font-semibold">Choose from Galery</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    }
    ,
    img: {
        height: 300,
        width: 300,
        resizeMode: 'contain'
    }
})