import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native';
import Loading from '../components/Loading';

import { A1, A2, B1, B2 } from '../colors';
export default function Messages({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getUserDetails = async () => {
            const storedUserId = await AsyncStorage.getItem('UserId');
            if (storedUserId) {
                firestore().collection('Users').where('userId', '==', storedUserId).get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty)
                            setUserData(querySnapshot.docs[0].data());
                    })
                    .catch(error => console.error('Error searching document: ', error));
            }
        };
        getUserDetails();

    }, []);

    useEffect(() => {
        if (userData) {
            const { follower, following } = userData;

            let list = new Set();
            if (follower)
                follower.forEach(element => {
                    list.add(element)
                })
            if (following)
                following.forEach(element => {
                    list.add(element)
                })

            let temp = [];
            if (list.size > 0) {
                firestore().collection('Users').where('userId', 'in', [...list]).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(documentSnapshot => {
                            temp.push(documentSnapshot.data());
                        });
                        setFriends(temp);
                    })
                    .catch(error => console.error('Error fetching friends: ', error));
            }
        }
    }, [userData]);

    // if (!userData) {
    //     return < Loading dataType={"Messages"} />
    // }
    return (
        <View style={{ height: '110%', backgroundColor: B1 }}>
            <View className=" justify-center items-center p-3" style={{ borderBottomColor: 'grey', borderBottomWidth: 0.4, display: 'flex', backgroundColor: A1 }}>
                <Text className="font-semibold text-white">Messages</Text>
            </View>

            {userData ? <View>
                <FlatList
                    data={friends}
                    renderItem={({ item }) => (
                        <View className=" flex-row items-center justify-between  px-2 bg-white ">
                            <View className=" flex-row items-center p-2 ">
                                {
                                    item.profilePicture ?
                                        <Image
                                            source={{ uri: item.profilePicture }}
                                            style={styles.displayPicture}
                                        />
                                        :
                                        <Image
                                            source={require('./../../assets/images/ProfilePicture.jpg')}
                                            style={styles.displayPicture}
                                        />
                                }

                                <Text className="text-black">{item.username}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() => { navigation.push("ChatScreen", { myId: userData.userId, myDp: userData.profilePicture, userId: item.userId, username: item.username, userdp: item.profilePicture }) }}
                                    className=" bg-sky-500 p-2  rounded-lg" style={{ backgroundColor: A2 }}  >
                                    <Text className="text-white font-semibold">Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.userId}
                />
            </View> : < Loading dataType={"Messages"} />}




        </View>
    );
}

const styles = StyleSheet.create({
    displayPicture: {
        height: 50,
        width: 50,
        borderRadius: 100,
        marginRight: 10,
    },
});
