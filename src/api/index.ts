import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.response.use((res:AxiosResponse) => res.data, (error:any) => Promise.reject(error));

export default instance;


/*
api.baseURL
fetch("https://trello-back.shpp.me/velkin/api/v1/board").then(res => res.json()).then(console.log)
*/