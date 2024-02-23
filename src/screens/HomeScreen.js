import { Button, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { utils } from '@react-native-firebase/app';
import BottomBar from '../components/BottomBar';
import storage from '@react-native-firebase/storage';
import Activity from '../tabs/Activity';
import Search from '../tabs/Search';
import Upload from '../tabs/Upload';
import Messages from '../tabs/Messages';
import Profile from '../tabs/Profile';
export default function MainScreen({ navigation }) {


    const [page, setPage] = useState(1);

    const temp = (s) => {
        console.log(s);
        setPage(s);
    }



    return (
        <View style={{ height: '100%', backgroundColor: "#e2e3de", marginBottom: 100 }} >

            {
                page == 1 ? <Activity /> : page == 2 ? <Search /> : page == 3 ? <Upload /> : page == 4 ? <Messages navigation={navigation} /> : <Profile />
            }

            <View style={{ position: 'absolute', width: '100%', bottom: 0, }} >
                <BottomBar st={temp} />
            </View >
        </ View >
    )
}

const styles = StyleSheet.create({})