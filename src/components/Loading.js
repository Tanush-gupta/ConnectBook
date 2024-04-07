import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function Loading({ dataType }) {
    const [color, setColor] = useState('teal');
    useEffect(() => {
        const id = setInterval(() => {
            setColor((color) => color == 'teal' ? 'royalblue' : 'teal');
        }, 700);
        return () => clearInterval(id);
    }, []);

    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color={color} style={styles.indicator} />
            <Text style={styles.indicatorText}>`Loading {dataType}...`</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {},
    indicatorText: {
        fontSize: 16,
        marginTop: 12,
        fontWeight: '600'
    },
})