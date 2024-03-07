import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
export default function Card({ Post }) {
    const navigation = useNavigation();
    const [like, setLike] = useState(false);
    const [userId, setUserId] = useState('');
    const [dp, setDp] = useState('');

    const getUserDetails = async () => {
        const storedUserId = await AsyncStorage.getItem('UserId');
        setUserId(storedUserId);
        firestore()
            .collection('Users')
            .where('userId', '==', Post.userid)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    setDp(querySnapshot.docs[0].data().profilePicture);
                }
            });
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    useEffect(() => {
        if (userId && Post.likes) {
            setLike(Post.likes.includes(userId));
        }
    }, [userId, Post.likes]);

    const commentPressed = () => {
        navigation.navigate('CommentScreen', { PostID: Post.post_id });
    };

    const LikePressed = async () => {
        let temp;
        if (like) {
            temp = Post.likes.filter(item => item !== userId);
        } else {
            temp = [...Post.likes, userId];
        }
        firestore()
            .collection('Post')
            .doc(Post.post_id)
            .update({
                likes: temp,
            })
            .then(() => {
                console.log('User updated!');
                setLike(!like);
            })
            .catch(error => console.error('Error updating document: ', error));
    };
    return (
        <View className=" my-4  bg-white p-4  rounded-[4px] ">
            <View className=" flex-row my-2 items-center">
                <View className=" mx-2">
                    {dp ? <Image
                        source={{ uri: dp }}
                        style={styles.displayPicture}
                    /> :
                        <Image
                            source={require('./../../assets/images/ProfilePicture.jpg')}
                            style={styles.displayPicture}
                        />}
                </View>
                <Text className=" text-[15px] text-black font-semibold">{Post.username}</Text>
            </View>

            <Image source={{ uri: Post.url }} className="" style={styles.img} />
            <View className="flex-row mx-0 p-2">
                <Text className="text-black font-semibold"> {Post.username}</Text>
                <Text> {Post.caption} </Text>
            </View>

            <View className="flex-row items-center mx-2">
                <TouchableOpacity onPress={LikePressed}>
                    {like ? (
                        <Image
                            className="h-9 w-9 p-1"
                            source={require('./../../assets/icons/heart1.png')}
                        />
                    ) : (
                        <Image
                            className="h-9 w-9 p-1"
                            source={require('./../../assets/icons/heart.png')}
                        />
                    )}
                </TouchableOpacity>
                <Text>{Post.likes ? Post.likes.length : 0}</Text>

                <TouchableOpacity onPress={commentPressed}>
                    <Image
                        className="h-7 w-7 p-1 mx-2"
                        source={require('./../../assets/icons/comment.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    img: {
        height: 400,
        width: 350,
        borderRadius: 20,
        resizeMode: 'stretch',
    },
    displayPicture: {
        height: 30,
        width: 30,
        borderRadius: 100,
    },
});
