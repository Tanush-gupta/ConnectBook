import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Octicons'
import Icon1 from 'react-native-vector-icons/Feather'


export default function BottomBar({ st }) {
    // const x = st;
    console.log(st);
    return (

        <View className=" flex-row justify-around p-3 bg-white" >

            <Icon name="home" size={30} color={st == 1 ? "blue" : "red"} onPress={() => st(1)} />


            <Icon
                name="search"
                size={30}
                color='#5b6b6e'
                onPress={() => st(2)

                }

            ></Icon>
            <Icon
                name="upload"
                size={30}
                color='#5b6b6e'
                onPress={() => st(3)}
            ></Icon>
            <Icon
                name="comment"
                size={30}
                color='#5b6b6e'
                onPress={() => st(4)}

            ></Icon>
            <Icon1
                name="user"
                size={30}
                color='#5b6b6e'
                onPress={() => st(5)}
            ></Icon1>
        </View >
    )
}

const styles = StyleSheet.create({

})