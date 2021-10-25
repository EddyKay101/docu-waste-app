import React from 'react';
import { View, StyleSheet } from 'react-native';
import Products from '../components/Products';
import Header from '../components/Header';
const WasteScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header
                title="Waste"
            />
            <View style={styles.wasteContainer}>
                <Products
                    storageKey="items"
                    navigation={navigation}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    wasteContainer: {
        marginTop: 30,
        marginLeft: 10
    }
})

export default WasteScreen;
