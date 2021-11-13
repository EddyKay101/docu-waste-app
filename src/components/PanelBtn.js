import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const PanelBtn = ({ label, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onPress()}>
                <View style={styles.panel}>
                    <View style={styles.top}>
                        <Text style={styles.label}>{label}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16
    },
    panel: {
        borderColor: '#616161',
        borderWidth: .5,
        flexDirection: 'column',
        maxWidth: 349,
        height: 165,
        backgroundColor: '#f8f9f9',
        borderRadius: 40,
        padding: 20,
    },
    label: {
        fontSize: 38,
        textAlign: 'center'
    },
})

export default PanelBtn;
