import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';
import Header from '../components/Header';
export default function Activity() {

    const [postData, setPostData] = useState([]);
    useEffect(() => {
        let temp = [];
        firestore()
            .collection('Post')
            .get()
            .then(querySnapshot => {
                // console.log('Total Posts: ', querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    temp.push(documentSnapshot.data());
                });
                setPostData(temp);
                // console.log(postData);
            });
    },);
    return (
        <View>
            <Header />
            <View className="h-full w-full justify-center items-center bg-gray-300">
                {postData.length > 0 ? (
                    <FlatList
                        data={postData}
                        renderItem={({ item }) => <Card Post={item} />}
                        keyExtractor={item => item.post_id}
                    />
                )
                    : (<Text>No post Found</Text>)
                }
            </View>
        </View>


    )
}

const styles = StyleSheet.create({})