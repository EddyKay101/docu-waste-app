import axios from 'axios';

export default axios.create({
    baseURL: 'https://docu-waste-api.herokuapp.com/product',
});