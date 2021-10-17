import React from 'react';
import {View, StyleSheet} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const ScanButton = (props) => {

    const managePresed = () => {
        // props.setOpened(true)
        props.setScanned(false);
    }
    return (
        <View>
            <MaterialCommunityIcons onPress={() => {
                props.setScanned(false) 
                props.setOpened(true)
                }} name="barcode-scan" color="black" style={styles.placement}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    placement: {
        alignSelf: 'center',
        margin: 16,
        fontSize: 300
    }
})

export default ScanButton;
