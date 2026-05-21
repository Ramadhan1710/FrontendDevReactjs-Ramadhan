import axios from "axios";

export const api = axios.create({
   baseURL: 'https://6a0d3885769682b8ee75ceaf.mockapi.io/api/v1',
})