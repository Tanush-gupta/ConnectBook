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
export default function MainScreen() {


    const [page, setPage] = useState(3);

    const temp = (s) => {
        console.log(s);
        setPage(s);
    }

    const Pressed = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        console.log(result.assets[0].fileName);
        const reference = storage().ref(result.assets[0].fileName);
        const pathToFile = result.assets[0].uri;
        await reference.putFile(pathToFile);
        console.log("DOne :)");
    }

    return (
        <View style={{ height: '100%', backgroundColor: "#e2e3de" }} >

            {
                page == 1 ? <Activity /> : page == 2 ? <Search /> : page == 3 ? <Upload /> : page == 4 ? <Messages /> : <Profile />
            }



            <View style={{ position: 'absolute', width: '100%', bottom: 0 }} >
                <BottomBar st={temp} />
            </View >
        </ View >
    )
}

const styles = StyleSheet.create({})