import axios from 'axios';

export const products = axios.create({
    baseURL: 'https://docu-waste-api.herokuapp.com/product',
});

export const waste = axios.create({
    baseURL: 'https://docu-waste-api.herokuapp.com/waste',
});