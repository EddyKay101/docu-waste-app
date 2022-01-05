import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import ScanButton from '../components/ScanButton';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as services from '../api/docu-waste';
import { Audio } from 'expo-av';
import Line from '../components/Line';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';


const ScanScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [opened, setOpened] = useState(false);
    const [sound, setSound] = useState();




    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);



    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/beep.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    const handleBarCodeScanned = async ({ data }) => {
        try {
            setScanned(true);
            setOpened(false);

            playSound();
            const res = await services.products.get(`/${data}`);
            await AsyncStorage.getItem('items')
                .then(async (items) => {
                    const i = items ? JSON.parse(items) : [];
                    const itemFound = i.some(el => el.barcode === res.data.result.barcode);
                    if (!itemFound) {
                        res.data.result.amount = 1;
                        res.data.result.cost = parseFloat(res.data.result.price).toFixed(2);
                        i.push(res.data.result);
                        await AsyncStorage.setItem('items', JSON.stringify(i))
                    } else {
                        const existingItem = i.filter((item) => {
                            const itemArray = item.barcode === res.data.result.barcode;
                            return itemArray;
                        });
                        const itemCost = parseFloat(existingItem[0].price).toFixed(2);
                        existingItem[0].amount += 1;
                        existingItem[0].cost = parseFloat((itemCost * existingItem[0].amount)).toFixed(2);
                        existingItem.push(existingItem[0]);
                        i.concat(existingItem);
                        AsyncStorage.setItem('items', JSON.stringify(i));
                    }


                });
        }
        catch (err) {

        }

    };


    if (hasPermission === null) {
        return <Text style={styles.requestMessage}>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text style={styles.requestMessage}>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <Header
                title="Scan"
            />
            {
                opened && <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={[StyleSheet.absoluteFill, styles.container]}>
                    <View style={styles.layerTop} />
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft} />
                        <View style={styles.focused}>
                            <Line />
                        </View>

                        <View style={styles.layerRight} />
                    </View>
                    <View style={styles.layerBottom} />
                </BarCodeScanner>
            }



            {
                opened === false &&
                <View style={styles.scanButton}>
                    <ScanButton
                        setScanned={setScanned}
                        setOpened={setOpened}
                    />
                </View>
            }

        </View>
    );
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity,

    },
    layerCenter: {
        flex: 1,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: 'green',
        borderStyle: 'dashed'
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
    requestMessage: {
        textAlign: 'center',
        marginTop: 50
    },
    scanButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ScanScreen;
