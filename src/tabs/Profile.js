import { Alert, Button, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
export default function Profile() {
    const [imgData, setImg] = useState(null);
    const [userData, setUserData] = useState(null);
    const [update, setUpdate] = useState(false)
    const [bio, setBio] = useState('');
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

    const Post = async () => {
        if (imgData?.assets?.length > 0) {
            const reference = storage().ref(imgData.assets[0].fileName);
            const pathToFile = imgData.assets[0].uri;
            await reference.putFile(pathToFile);
            const url = await storage().ref(imgData.assets[0].fileName).getDownloadURL();
            firestore()
                .collection('Users')
                .doc(userData.userId).update({
                    profilePicture: url,
                })
                .then(() => {
                    Alert.alert('Confirmation', 'DP Updated');
                    setImg(null);
                }).catch(error => { console.log(error) });
        }
    };


    const updateBio = () => {
        if (!bio) {
            Alert.alert('Invalid Bio', 'Enter a valid Bio');
        }
        else {

            firestore()
                .collection('Users')
                .doc(userData.userId).update({
                    bio: bio,
                })
                .then(() => {
                    Alert.alert('Bio Updated');
                    setUpdate(false);
                }).catch(error => { console.log(error) });


        }


    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedUserId = await AsyncStorage.getItem('UserId');
            if (storedUserId) {
                firestore()
                    .collection('Users')
                    .where('userId', '==', storedUserId)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            setUserData(querySnapshot.docs[0].data());
                        }
                    });
            }
        };
        fetchUserDetails();
    }, [update]);

    if (!userData) {
        return <View><Text>Loading...</Text></View>;
    }

    const changeDP = async () => {
        Galery();
        Post();
    }

    return (
        <View>
            {userData && (
                <View className="p-5 items-center">
                    <View className=" flex my-2 items-center w-full bg-slate-100  my-20 p-5  rounded-xl" style={styles.shadow}>
                        <TouchableOpacity className=" mx-2" onLongPress={changeDP}>

                            {
                                userData.profilePicture ?
                                    <Image source={{ uri: userData.profilePicture }} style={styles.displayPicture} />
                                    :
                                    <Image source={require('./../../assets/images/ProfilePicture.jpg')} style={styles.displayPicture} />
                            }

                        </TouchableOpacity>
                        <View className="my-3">
                            <Text className=" text-[20px] text-black font-semibold">{userData.username}</Text>
                        </View>
                        {
                            !update &&
                            <View className=" bg-sky-200  p-2 rounded-xl my-2">
                                <Text> {userData.bio} </Text>
                            </View>
                        }


                        {update ? <View>
                            <TextInput placeholder='Enter the Bio' placeholderTextColor={'gray'} textAlign='center' value={bio} onChangeText={(e) => { setBio(e) }} className="rounded-xl bg-slate-300  p-2 " ></TextInput>
                            <View className=" flex-row p-1 my-2 ">
                                <TouchableOpacity className="rounded-[10px] p-2  w-22 bg-sky-400 mx-2 " onPress={updateBio} >
                                    <Text className="font-semibold   text-gray-100 " >Change</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="rounded-[10px] p-2  w-22 bg-sky-400 " onPress={() => { setUpdate(false) }} >
                                    <Text className="font-semibold   text-gray-100  "> Cancel </Text>
                                </TouchableOpacity>
                            </View>
                        </View> :
                            <TouchableOpacity className="rounded-[10px] p-2  w-22 bg-sky-400 " onPress={() => { setUpdate(true) }} >
                                <Text className="font-semibold   text-gray-100  ">Update About </Text>
                            </TouchableOpacity>
                        }





                        <View className=" flex-row justify-around w-full m-5">
                            <View className=" justify-center items-center" style={styles.box}>
                                <Text className="text-grey font-semibold ">{userData.followers ? userData.followers.length : 0}</Text>
                                <Text className="text-grey font-semibold ">Followers</Text>
                            </View>
                            <View className=" justify-center items-center" style={styles.box}>
                                <Text className="text-gray font-semibold  ">{userData.following ? userData.following.length : 0}</Text>
                                <Text className="text-gray font-semibold ">Following</Text>
                            </View>
                        </View>

                    </View>

                </View>

            )
            }

        </View >
    )
}

const styles = StyleSheet.create({
    displayPicture: {

        height: 200,
        width: 200,
        borderRadius: 1000
    },
    box: {
        // borderWidth: 1,

        borderRadius: 10,
        borderBlockColor: 'white',
        backgroundColor: '#edfca7',
        marginVertical: 16,
        paddingHorizontal: 12,
        // paddingHorizontal: 10
        paddingVertical: 10

    },
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
})