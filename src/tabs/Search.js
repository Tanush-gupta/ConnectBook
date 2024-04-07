import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native';

export default function Search() {
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    let following = [''];

    useEffect(() => {
        (async () => {
            const storedUserId = await AsyncStorage.getItem('UserId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        })();
    }, []);

    useEffect(() => {
        if (userId && userData) {
            getUserDetails(userId);
        }
    }, [following]);

    useEffect(() => {
        if (userId) {
            firestore()
                .collection('Users')
                .where('userId', '==', userId)
                .get()
                .then(querySnapshot => {
                    const userData = querySnapshot.docs.map(doc => doc.data())[0]; // Adjusted to map and get the first item
                    setUserData(userData);
                })
                .catch(error => console.error('Error fetching user data: ', error));
        }
    }, [userId]);

    const getUserDetails = async userId => {
        const userRef = firestore().collection('Users');
        const currentUserDoc = await userRef.where('userId', '==', userId).get();
        if (!currentUserDoc.empty) {
            const userDocData = currentUserDoc.docs[0].data();
            setUserData(userDocData);
            const following = userDocData.following;
            userRef
                .where('userId', 'not-in', [...following, userId])
                .get()
                .then(querySnapshot => {
                    const fetchedUsers = querySnapshot.docs.map(doc => doc.data());
                    setUsers(fetchedUsers);
                })
                .catch(error => console.error('Error searching document: ', error));
        }
    };

    const follow = async userIdToFollow => {
        following = userData.following
            ? [...userData.following, userIdToFollow]
            : [userIdToFollow];
        try {
            await firestore().collection('Users').doc(userId).update({
                following: following,
            });
            setUserData({ ...userData, following });
        } catch (error) {
            console.error('Error updating document: ', error);
        }

        try {
            const userToFollowRef = firestore().collection('Users').doc(userIdToFollow);
            const doc = await userToFollowRef.get();
            if (doc.exists) {
                let { followers } = doc.data();
                followers = followers ? [...followers, userId] : [userId];
                await userToFollowRef.update({ followers });
                console.log('User followed!');
            }
        } catch (error) {
            console.error('Error updating document: ', error);
        }



    };

    return (
        <View style={{ backgroundColor: '#000a1a', height: "200%" }} >
            < View >
                <View className="flex-row items-center  m-2  rounded-3xl bg-white "  >

                    <Image
                        source={require('./../../assets/icons/searchg.png')}
                        className="h-6 w-6 ml-3"
                    />
                    <TextInput
                        placeholder="Search By Name"
                        placeholderTextColor={'gray'}
                        className="ml-3"
                        onChangeText={e => setSearch(e)}></TextInput>
                </View>

                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <View className=" flex-row items-center justify-between  px-2 bg-white rounded-lg ">
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
                                    className=" bg-sky-500 p-2  rounded-lg"
                                    onPress={() => follow(item.userId)}>
                                    <Text className="text-white font-semibold">Follow</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.userId}
                />
            </View >
        </View >
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
