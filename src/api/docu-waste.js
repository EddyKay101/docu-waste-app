import axios from 'axios';

export const products = axios.create({
    baseURL: 'https://docu-waste-api.herokuapp.com/product',
});

export const waste = axios.create({
    baseURL: 'https://docu-waste-api.herokuapp.com/waste',
});

export const postWaste = (async (data) => {
    await axios.post('https://docu-waste-api.herokuapp.com/waste', data)
        .then((res) => {
            return res.data.result.message;
        })
        .catch((err) => {
            console.log(err)
        })
})

export const postProduct = (async (data, message = "") => {
    await axios.post('https://docu-waste-api.herokuapp.com/products', data)
        .then((res) => {
            message = res.data.result.message;
        })
        .catch((err) => {
            message = err.response.data.result;
        })
    return message;
})
