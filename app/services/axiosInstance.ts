import axios from 'axios';

export const apiPost = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
});
