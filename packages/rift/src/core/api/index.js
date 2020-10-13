import axios from 'axios';
import client from './apollo';
export const graphql = client;

export async function get(url) {
	const response = await axios.get(url);
	return response;
}

export async function post(url, data) {
	const response = await axios.post(url, data);
	return response.data;
}
