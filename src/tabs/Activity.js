import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { A1, A2, B1, B2 } from '../colors';
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
        <View style={{ backgroundColor: 'white' }} className="  mb-24">
            <Header navigation={navigation} />
            <View className=" w-full justify-center items-center" style={{ backgroundColor: B1 }}>
                {postData.length > 0 ? (

                    < FlatList
                        data={postData}
                        renderItem={({ item }) => <Card Post={item} />}
                        keyExtractor={item => item.post_id}
                    />

                )
                    : <Text className="text-center top-[200%]">  <Loading dataType={'Fetching Posts'} /> </Text>
                }
            </View>
        </View >


    )
}

const styles = StyleSheet.create({})