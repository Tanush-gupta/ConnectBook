import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'


export default function Splash() {
    return (
        <View className="h-full w-full  bg-sky-000 justify-center items-center">
            <Text className="font-bold text-3xl text-amber-950"> ConnectBook </Text>
            <Text className="font-semibold text-red-600 text-1xl">The Social App</Text>
        </View >
    )
}

const styles = StyleSheet.create({})