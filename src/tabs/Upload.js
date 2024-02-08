import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';


export default function Upload() {
    const [imgData, setImg] = useState(null);
    const [caption, setCaption] = useState();

    let result = null;
    const Galery = async () => {
        result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            setImg(result);
        }
        console.log(imgData);
    }
    const Camera = async () => {
        result = await launchCamera({ mediaType: 'photo' });
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
        const reference = storage().ref(imgData.assets[0].fileName);
        const pathToFile = imgData.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage().ref(imgData.assets[0].fileName).getDownloadURL();
        console.log(url);
    }


    return (
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