import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { AntDesign, Foundation } from '@expo/vector-icons';


const Panel = ({ label, value, icon }) => {
    return (
        <View style={styles.container}>
            <View style={styles.panel}>
                <View>
                    <Text style={styles.label}>{label}</Text>


                </View>
                <View style={styles.bottom}>
                    {
                        icon === 'barcode' ? <AntDesign name={icon} color="black" style={styles.icon} /> : <Foundation name={icon} color="black" style={styles.icon} />
                    }
                    <Text style={styles.value}>{value}</Text>
                </View>
            </View>
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
        height: Dimensions.get('screen').height - 3000,
        backgroundColor: '#f8f9f9',
        borderRadius: 40,
        padding: 20,

    },
    label: {
        fontSize: 38,
        textAlign: 'center'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 30

    },
    value: {
        fontSize: 80,
        textAlign: 'center',
        flex: 2,
        color: '#004d40'
    },
    icon: {
        fontSize: 30,
    }
})

export default Panel;
