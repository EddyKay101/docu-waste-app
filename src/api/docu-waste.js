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
            return res.message;
        })
        .catch((err) => {
            console.log(err)
        })
})
