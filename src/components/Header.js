import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { StackActions } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TopBar({ navigation }) {
    return (
        <View className=" bg-white p-3 flex-row justify-between">
            <Text className="font-bold text-2xl text-black mx-5">CₒₙₙₑcₜBₒₒₖ</Text>

            <TouchableOpacity className=" bg-sky-500  items-center justify-center p-2 rounded-[8px]
            "
                onPress={() => { AsyncStorage.clear() }}
            >
                <Text className=" text-white  font-bold">Log out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})