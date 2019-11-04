import axios from 'axios';
import commonConfig from '../config/common';

const apiClient = (config) => axios({ baseURL: commonConfig.api.base, ...config });

export default apiClient;

export const initializeAxiosInterceptors = (
	accessToken,
	requestInterceptorCB,
	responseInterceptorCB
) => {
	axios.interceptors.request.use(
		(config) => {
			const { headers, noloading, ...rest } = config;
			requestInterceptorCB(config);

			return {
				headers: {
					'x-id-token': accessToken,
					...headers,
				},
				...rest,
			};
		},
		(error) => Promise.reject(error)
	);
	axios.interceptors.response.use(
		(response) => {
			responseInterceptorCB(response);
			return response;
		},
		(error) => Promise.reject(error)
	);
};
