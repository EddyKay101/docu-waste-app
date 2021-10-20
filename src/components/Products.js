import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Products = () => {
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0)
    useEffect(() => {
        getItem();
    }, []);



    const getItem = async () => {
        const t = [];
        await AsyncStorage.getItem('items')
            .then((value) => {
                if (value !== null) {
                    let parsedData = JSON.parse(value);
                    setResults(() => parsedData);

                    parsedData.map((data) => {
                        t.push(data);
                    });

                    const totalArr = t.reduce((prev, cur) => {
                        return prev + cur.amount;
                    }, 0);
                    if (totalArr) {
                        setTotal(total + totalArr);
                    }

                }
            })
    }


    const removeItem = async () => {
        try {
            await AsyncStorage.removeItem('items')
            .then(() => {
                setTotal(0);
                setResults([]);
            })
            
            
        } catch (e) {

        }
    }
    return (
        <View style={styles.container}>
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
                                <Text style={styles.headerText}>Amount</Text>
                            </View>
                            <View>
                                <Text style={styles.headerText}>Cost</Text>
                            </View>
                        </View>

                        <View>


                            <FlatList
                                style={styles.scrollViewHeader}
                                keyExtractor={(product) => product.barcode}
                                data={results}
                                extraData={results}
                                renderItem={({ item }) => {
                                    return (
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
                                    );
                                }}
                            />
                            <View style={styles.lineTotal}>
                                <Text>Total Wastage</Text>
                                <Text>{total}</Text>
                            </View>
                            <Button title="clear" onPress={() => removeItem()} />
                        </View>
                    </View>
                    :
                    <View>
                        <Text>No wastage at the moment</Text>
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

    }

})

export default Products;
