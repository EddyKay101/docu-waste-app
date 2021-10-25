import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Panel from '../components/Panel';
import PanelBtn from '../components/PanelBtn';
const HomeScreen = ({ navigation }) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const unsubscribed = navigation.addListener('focus', () => {
            getTotal();
        })
        return () => {
            unsubscribed();
        };
    }, [navigation]);
    const getTotal = async () => {
        const tabularData = [];
        await AsyncStorage.getItem("items")
            .then((value) => {
                if (value !== null) {
                    let parsedData = JSON.parse(value);
                    parsedData.map((data) => {
                        tabularData.push(data);
                    });

                    const overallAmount = tabularData.reduce((prev, cur) => {
                        return prev + cur.amount;
                    }, 0);
                    const overallCost = tabularData.map(item => item.cost).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
                    setTotalAmount(totalAmount + overallAmount);
                    setTotalCost(totalCost + parseFloat(overallCost).toFixed(2));
                } else {
                    setTotalAmount(0);
                    setTotalCost(0.00);
                }
            })
    }
    return (
        <View style={styles.container}>
            <Panel
                label="Items Scanned"
                value={totalAmount}
                icon="barcode"
            />
            <Panel
                label="Wastage Cost"
                value={parseFloat(totalCost).toFixed(2)}
                icon="pound"
            />
            <PanelBtn
                label="Scan Items"
                onPress={() => navigation.navigate("Scan")}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1
    },
})

export default HomeScreen;
