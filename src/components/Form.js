import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const Form = () => {
    const [product, setProduct] = useState("");
    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState("");
    return (
        <View style={styles.container}>
            <TextInput
                onChangeText={(val) => setProduct({ ...product, product_name: val })}
                style={styles.text}
                autoCompleteType='off'
                placeholder='Product Name'
                placeholderTextColor="#cfcfd4"
            />
            <TextInput
                onChangeText={(val) => setBarcode({ ...barcode, barcode_number: val })}
                style={styles.text}
                autoCompleteType='off'
                placeholder='Barcode'
                placeholderTextColor="#cfcfd4"
            />
            <TextInput
                onChangeText={(val) => setPrice({ ...price, price: val })}
                style={styles.text}
                autoCompleteType='off'
                placeholder='Price'
                placeholderTextColor="#cfcfd4"
            />
            <TouchableOpacity style={styles.btn} onPress={() => {
                console.log({ ...product, ...barcode, ...price });
                setProduct("");
            }}>
                <LinearGradient
                    colors={["#004d40", "#009688"]}
                    style={{ borderRadius: 10 }}
                >
                    <Text style={styles.btnTxt}>Save Product</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    text: {
        borderColor: '#cfcfd4',
        borderWidth: 1,
        height: 50,
        marginTop: 16,
        borderRadius: 10,
        paddingLeft: 16
    },
    btn: {
        width: 150,
        padding: 16,
        alignSelf: 'center'
    },
    btnTxt: {
        textAlign: 'center',
        margin: 16,
        color: '#ffffff'
    }
})

export default Form;
