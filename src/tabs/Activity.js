import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';
import Header from '../components/Header';
export default function Activity({ navigation }) {

    const [postData, setPostData] = useState([]);
    useEffect(() => {
        let temp = [];
        firestore()
            .collection('Post')
            .get()
            .then(querySnapshot => {
                console.log('Total Posts: ', querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    temp.push(documentSnapshot.data());
                });
                setPostData(temp);
                // console.log(postData);
            }).catch(error => console.error('Error searching document: ', error));
    }, []);
    return (
        <View style={{ backgroundColor: '#303236' }}>
            <Header navigation={navigation} />
            <View className=" w-full justify-center items-center" style={{ backgroundColor: "#000a1a" }}>
                {postData.length > 0 ? (

                    < FlatList
                        data={postData}
                        renderItem={({ item }) => <Card Post={item} />}
                        keyExtractor={item => item.post_id}
                    />

                )
                    : <ActivityIndicator size="large" />
                }
            </View>
        </View >


    )
}

const styles = StyleSheet.create({})