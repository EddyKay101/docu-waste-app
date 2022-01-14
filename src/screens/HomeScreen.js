import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Dimensions, KeyboardAvoidingView } from 'react-native';
import Panel from '../components/Panel';
import PanelBtn from '../components/PanelBtn';
import Form from '../components/Form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const HomeScreen = ({ navigation }) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >

                <View style={styles.centeredView}>
                    <MaterialCommunityIcons name="close-thick" onPress={() => setModalVisible(!modalVisible)} style={styles.icon} />
                    <View style={styles.modalView}>
                        <Text>Add a new food item, existing items will not be saved</Text>
                        <Form
                            setModalVisible={setModalVisible}
                        />
                    </View>
                </View>
            </Modal>

            <View style={{ padding: 16, marginTop: 65 }}>
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
                    label="Add Products"
                    onPress={() => setModalVisible(true)}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'relative'
    },
    modalView: {
        width: '100%',
        minHeight: '45%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    icon: {
        fontSize: 25,
        left: '40%',
        top: '7%',
        zIndex: 1000,
        elevation: 5,
        color: '#004d40'
    }
});


export default HomeScreen;
