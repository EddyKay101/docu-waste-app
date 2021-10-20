import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const NavBar = ({ navigation, screen, setOpened, setScanned }) => {
    return (
        <View style={styles.container}>
            <View><MaterialCommunityIcons onPress={() => {
                setScanned(false)
                setOpened(true)
            }} name="barcode-scan" color="black" style={styles.icons}
            /></View>

            <View>
                <Entypo onPress={() => navigation.navigate(screen)}
                    name="trash" color="black" style={styles.icons}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    icons: {
        fontSize: 40
    }
})

export default NavBar;
