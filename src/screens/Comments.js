import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { Image } from 'react-native';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Comments({ route, navigation }) {

    const postId = route.params.PostID;
    const [comment, setComment] = useState(null)
    const [postData, setPostData] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState();


    const getUserDetails = async () => {
        const storedUsername = await AsyncStorage.getItem('Username');
        const storedEmail = await AsyncStorage.getItem('Email');
        const storedUserId = await AsyncStorage.getItem('UserId');
        setUsername(storedUsername);
        setEmail(storedEmail);
        setUserId(storedUserId);
    }



    useEffect(() => {
        getUserDetails();
        firestore()
            .collection('Post')
            .where('post_id', '==', postId)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    setPostData(querySnapshot.docs[0].data()); // Use data() method to get the document data
                }
            });
    }, [comment]);
    const addComment = async () => {
        if (comment && postData && postId && username && userId) { // Ensure all necessary data is available
            const newComment = {
                comment: comment,
                username: username,
                userId: userId,
            };
            // Initialize comments array if it doesn't exist in postData
            const updatedComments = postData.comments ? [...postData.comments, newComment] : [newComment];

            try {
                await firestore()
                    .collection('Post')
                    .doc(postId)
                    .update({
                        comments: updatedComments, // Ensure your Firestore document structure uses 'comments' for storing an array of comments
                    });
                console.log('Comment Added!');
            } catch (error) {
                console.error('Error adding comment:', error); // Error handling
            }
        }
        setComment(null); // Reset comment input field
    }

    return (
        <View className="h-full">
            <View className=" justify-center items-center p-3  bg-white " style={{ borderBottomColor: 'grey', borderBottomWidth: 0.4, display: 'flex' }}>
                <Text className="font-semibold text-black">Comments</Text>
            </View>


            {postData && (
                <>
                    <View className=" flex-row my-2 items-center">
                        <View className=" mx-2">
                            <Image source={require('./../../assets/images/ProfilePicture.jpg')} style={styles.displayPicture} />
                        </View>

                        <Text className=" text-[25px] text-black font-semibold">{postData.username}</Text>
                    </View>
                    <View className=" flex-row mx-2 items-center p-2">
                        <Text className="text-[20px]">... {postData.caption}</Text>
                    </View>
                    <View style={{ borderWidth: 0.2, borderBlockColor: 'grey' }} />



                    <View>
                        <FlatList
                            data={postData.comments}
                            renderItem={({ item }) => (
                                <View className="flex-row p-2 items-center">
                                    <View className=" mx-2">
                                        <Image source={require('./../../assets/images/ProfilePicture.jpg')} style={styles.displayPicture} />
                                    </View>
                                    <Text className="font-semibold mr-3 text-[16px]">{item.username}</Text>
                                    <Text>{item.comment}</Text>
                                </View>

                            )}
                            keyExtractor={item => item.post_id}
                        />
                    </View>

                </>
            )}








            <View style={{ position: 'absolute', bottom: 0 }} className="flex-row items-center justify-between p-2  bg-gray-200 " >
                <View className="p-2 w-80 ">
                    <TextInput placeholder='Write Comment..' className=" bg-white rounded-xl"
                        value={comment} onChangeText={(e) => { setComment(e) }} ></TextInput>
                </View>
                <TouchableOpacity className="bg-sky-500 p-2 " onPress={addComment}>
                    <Text className="text-white">Comment</Text>
                </TouchableOpacity>
            </View>

        </View>


    )
}

const styles = StyleSheet.create({
    displayPicture: {

        height: 30,
        width: 30,
        borderRadius: 100
    }
})