import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Header = ({ title }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContents}>
                <Text style={styles.title}>{title}</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#cfcfd4',
        height: 110
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    headerContents: {
        marginLeft: 35,
        marginTop: 60
    }
})

export default Header;
