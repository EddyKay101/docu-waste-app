import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Alert, Platform, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as services from '../api/docu-waste';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false, }) });
async function registerForPushNotificationsAsync() { let token; if (Constants.isDevice) { const { status: existingStatus } = await Notifications.getPermissionsAsync(); let finalStatus = existingStatus; if (existingStatus !== 'granted') { const { status } = await Notifications.requestPermissionsAsync(); finalStatus = status; } token = (await Notifications.getExpoPushTokenAsync()).data; } else { console.log('Must use physical device for Push Notifications'); } if (Platform.OS === 'android') { Notifications.setNotificationChannelAsync('default', { name: 'default', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 250, 250, 250], lightColor: '#FF231F7C', }); } return token; }

const sendPushNotification = async (expoPushToken) => {
    console.log(expoPushToken)
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Docu Waste',
        body: 'Don\'t forget to save your waste'
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

const Products = ({ storageKey, navigation }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [isWasteEdit, setEdit] = useState(false);
    const [summary, setSummary] = useState({});
    const [itemEdit, setItemEdit] = useState(false);
    const [value, setValue] = useState({
    });

    useEffect(() => {
        // let interval;
        const unsubscribed = navigation.addListener('focus', () => {
            getItem();
        });
        // getItem();
        // const interval = setInterval(() => {
        //     checkIfData();
        // }, 60000);
        if (Constants.isDevice && Platform.OS !== 'web') {
            registerForPushNotificationsAsync().then(token => {
                axios.post(`https://nativenotify.com/api/expo/key`, { appId: 618, appToken: 'ZC7EdbXIhylkdCtqd7yg5X', expoToken: token })
                setExpoPushToken(token);
            });
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => console.log(response));
            return () => {
                Notifications.removeNotificationSubscription(notificationListener);
                Notifications.removeNotificationSubscription(responseListener);
            };
        }
        return () => {
            unsubscribed();
            // clearInterval(interval);
        };
    }, [navigation]);


    const checkIfData = () => {
        if (results.length > 0) {
            sendPushNotification(expoPushToken)
        }

    }

    const getItem = async () => {
        const tabularData = [];
        await AsyncStorage.getItem(storageKey)
            .then((value) => {
                if (value !== null) {
                    let parsedData = JSON.parse(value);
                    setResults(() => parsedData);

                    parsedData.map((data) => {
                        tabularData.push(data);
                    });

                    const totalAmount = tabularData.reduce((prev, cur) => {
                        return prev + cur.amount;
                    }, 0);
                    if (totalAmount) {
                        setTotal(totalAmount);
                    }

                }
            })
    }
    const removeItem = async () => {
        try {
            await AsyncStorage.removeItem(storageKey)
                .then(() => {
                    setTotal(0);
                    setResults([]);
                })
        } catch (e) {
        }
    }

    const saveWastage = () => {
        results.map((res) => {
            services.postWaste({
                product: res.product_name,
                price: parseFloat(res.price).toFixed(2),
                amount: res.amount,
                cost: res.cost
            })
                .then(() => {
                    removeItem();
                })
        })

    }

    const clearWasteAlert = () =>
        Alert.alert(
            "Confirmation",
            "Are you sure you want to clear waste?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        return;
                    },
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        removeItem();
                    }
                }
            ]
        );

    const saveWasteAlert = () =>
        Alert.alert(
            "Confirmation",
            "Items would be sent for analytics, do you want to continue?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        return;
                    },
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        saveWastage();
                    }
                }
            ]
        );

    const handleProductSummary = (data, barcode) => {
        setEdit(true);
        const productSummary = data.filter(result => result.barcode === barcode);

        productSummary.map(summary => {
            setSummary(() => summary);
        })
    };

    const handleSaveWasteItem = async (obj, value) => {
        try {
            await AsyncStorage.getItem(storageKey)
                .then(async (items) => {
                    const i = items ? JSON.parse(items) : [];
                    const existing = i.filter(item => {
                        const itemArr = item.barcode === obj.barcode;
                        return itemArr;
                    });
                    const itemCost = parseFloat(existing[0].price).toFixed(2);
                    existing[0].amount = 0 + parseInt(value.amount);
                    existing[0].cost = parseFloat((itemCost * existing[0].amount)).toFixed(2);
                    existing.push(existing[0]);
                    i.concat(existing);
                    AsyncStorage.setItem(storageKey, JSON.stringify(i));
                    handleProductSummary(i, obj.barcode);
                });

        } catch (e) {

        }

    };



    return (
        <View style={styles.container}>
            {/* <Button
                title="Press to Send Notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            /> */}

            {
                !isWasteEdit ?
                    <View>
                        {
                            results.length > 0 ?
                                <View>
                                    <View style={styles.header}>
                                        <View>
                                            <Text style={styles.headerText}>Product</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headerText}>Price</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headerText}>Qty</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headerText}>Cost</Text>
                                        </View>
                                    </View>

                                    <View>

                                        <View>
                                            <FlatList
                                                style={styles.scrollViewHeader}
                                                keyExtractor={(product) => product.barcode}
                                                data={results}
                                                extraData={results}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View>
                                                            <TouchableOpacity onPress={() => handleProductSummary(results, item.barcode)}>
                                                                <View style={styles.scrollView}>
                                                                    <View style={styles.columnOne}>
                                                                        <Text style={{ margin: 2 }}>{item.product_name}</Text>
                                                                    </View>
                                                                    <View style={styles.columnTwo}>
                                                                        <Text>£ {item.price}</Text>
                                                                    </View>
                                                                    <View style={styles.columnThree}>
                                                                        <Text>{item.amount}</Text>
                                                                    </View>
                                                                    <View style={styles.columnFour}>
                                                                        <Text>£ {item.cost}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>

                                                        </View>


                                                    );
                                                }}
                                            />
                                            <View style={styles.lineTotal}>
                                                <Text>Total Wastage</Text>
                                                <Text>{total}</Text>
                                            </View>
                                            <View style={styles.wasteButtonContainer}>
                                                <TouchableOpacity style={styles.wasteBtn} onPress={() => saveWasteAlert()}>
                                                    <LinearGradient
                                                        colors={["#004d40", "#009688"]}
                                                        style={{ borderRadius: 10 }}
                                                    >
                                                        <Text style={styles.wasteBtnTxt}>Save Waste</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.wasteBtn} onPress={() => clearWasteAlert()}>
                                                    <LinearGradient
                                                        colors={["#004d40", "#009688"]}
                                                        style={{ borderRadius: 10 }}
                                                    >
                                                        <Text style={styles.wasteBtnTxt}>Clear</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </View>




                                    </View>
                                </View>
                                :
                                <View>
                                    <Text>No wastage at the moment</Text>
                                </View>
                        }

                    </View> :

                    <View>
                        <View style={styles.productSummaryTable}>
                            <View style={styles.productSummaryItem}>
                                <View>
                                    <Text style={styles.label}>Product</Text>
                                </View>
                                <View>
                                    <Text>{summary.product_name}</Text>
                                </View>
                            </View>
                            <View style={styles.productSummaryItem}>
                                <View>
                                    <Text style={styles.label}>Price</Text>
                                </View>
                                <View>
                                    <Text>£{summary.price}</Text>
                                </View>
                            </View>
                            <View style={styles.productSummaryItem}>
                                <View>
                                    <Text style={styles.label}>Qty</Text>
                                </View>
                                <View>
                                    {
                                        !itemEdit ?
                                            <Text>{summary.amount}</Text> :
                                            <TextInput
                                                onChangeText={(val) => setValue({ ...value, amount: val })}
                                                keyboardType='numeric'
                                                style={styles.text}
                                                autoCompleteType='off'
                                                placeholder='qty'
                                                autoFocus={true}
                                            />
                                    }

                                </View>
                            </View>
                            <View style={styles.productSummaryItem}>
                                <View>
                                    <Text style={styles.label}>Cost</Text>
                                </View>
                                <View>
                                    <Text>£{summary.cost}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.wasteButtonContainer}>
                            {
                                !itemEdit ?
                                    <View>
                                        <TouchableOpacity style={styles.wasteBtn} onPress={() => {
                                            setItemEdit(true);
                                        }}>
                                            <LinearGradient
                                                colors={["#004d40", "#009688"]}
                                                style={{ borderRadius: 10 }}
                                            >
                                                <Text style={styles.wasteBtnTxt}>Edit Item</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View> :



                                    <View>
                                        <TouchableOpacity style={styles.wasteBtn} onPress={() => {
                                            setItemEdit(false);
                                            handleSaveWasteItem(summary, value);
                                        }}>
                                            <LinearGradient
                                                colors={["#004d40", "#009688"]}
                                                style={{ borderRadius: 10 }}
                                            >
                                                <Text style={styles.wasteBtnTxt}>Save</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                            }



                            <View>
                                <TouchableOpacity style={styles.wasteBtn} onPress={() => {
                                    setEdit(false);
                                    getItem();

                                }}>
                                    <LinearGradient
                                        colors={["#004d40", "#009688"]}
                                        style={{ borderRadius: 10 }}
                                    >
                                        <Text style={styles.wasteBtnTxt}>Go Back</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>
            }

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: .5,
        borderBottomColor: '#cfcfd4'
    },
    headerText: {
        fontWeight: 'bold',
    },

    scrollView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 3,
        flexWrap: 'wrap',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#cfcfd4'
    },
    columnOne: {
        flex: 1,
        borderRightWidth: 0.5,
        justifyContent: 'center',
        borderColor: '#cfcfd4'
    },
    columnTwo: {
        flex: 1,
        alignItems: 'center',
        flex: 1,
        borderRightWidth: 0.5,
        justifyContent: 'center',
        borderColor: '#cfcfd4',
        backgroundColor: '#ebecf0'
    },
    columnThree: {
        flex: 1,
        alignItems: 'center',
        borderRightWidth: 0.5,
        justifyContent: 'center',
        borderColor: '#cfcfd4'
    },
    columnFour: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: '#ebecf0'
    },
    lineTotal: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    scrollViewHeader: {
        maxHeight: 400,
    },
    wasteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 16
    },
    wasteBtn: {
        width: 150,
        padding: 16
    },
    wasteBtnTxt: {
        textAlign: 'center',
        margin: 16,
        color: '#ffffff'
    },
    productSummaryTable: {
        flexDirection: 'column',
        borderColor: 'red'
    },
    productSummaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
        borderBottomColor: '#dddd',
        borderBottomWidth: 1
    },
    label: {
        fontWeight: 'bold'
    },
    text: {
        width: 70
    }

})

export default Products;
