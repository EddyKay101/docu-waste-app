import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const NavBar = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Entypo onPress={() => {
                navigation.navigate("Splash");
            }}
                name="home" color="black" style={styles.icons}
            />
            <View><MaterialCommunityIcons onPress={() => {
                navigation.navigate("Scan");
            }} name="barcode-scan" color="black" style={styles.icons}
            /></View>

            <View>
                <Entypo onPress={() => navigation.navigate("Waste")}
                    name="trash" color="black" style={styles.icons}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        height: 100,
        backgroundColor: '#cfcfd4',
        position: 'absolute',
        bottom: 0,
    },
    icons: {
        fontSize: 40
    }
})

export default NavBar;
