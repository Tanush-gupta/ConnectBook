import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
export default function Profile() {

    const [userData, setUserData] = useState(null);

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
                            setUserData(querySnapshot.docs[0].data()); // Use .data() to get the document data
                        }
                    });
            }
        };
        fetchUserDetails();
    }, []); // Add an empty dependency array to ensure this effect runs only once

    if (!userData) {
        return <View><Text>Loading...</Text></View>; // Show a loading or placeholder view
    }

    return (
        <View>
            {userData && (
                <View className="p-5 items-center">
                    <View className=" flex my-2 items-center w-full bg-slate-100  my-20 p-5  rounded-xl" style={styles.shadow}>
                        <View className=" mx-2">
                            <Image source={require('./../../assets/images/ProfilePicture.jpg')} style={styles.displayPicture} />
                        </View>
                        <View className="my-3">
                            <Text className=" text-[20px] text-black font-semibold">{userData.username}</Text>
                        </View>

                        <View className=" bg-sky-200  p-2 rounded-xl my-2">
                            <Text> {userData.bio} </Text>
                        </View>

                        <View className=" flex-row justify-around w-full m-5">
                            <View className=" justify-center items-center" style={styles.box}>
                                <Text className="text-grey font-semibold ">{userData.follwers ? userData.follwers.length : 0}</Text>
                                <Text className="text-grey font-semibold ">Followers</Text>
                            </View>
                            <View className=" justify-center items-center" style={styles.box}>
                                <Text className="text-gray font-semibold  ">{userData.following ? userData.following.length : 0}</Text>
                                <Text className="text-gray font-semibold ">Following</Text>
                            </View>
                        </View>

                    </View>
                    <TouchableOpacity className="rounded-xl bg-red-500 p-3  w-22 " style={styles.shadow}>
                        <Text className="font-semibold text-white"> EDIT PROFILE </Text>
                    </TouchableOpacity>
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