import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ResponseAPI<T> {
	code: number
	data: T | null
	message: string
	title: string
	type: string
}

const APIRequest = <ResponseAPI,>(
	method: string,
	url: string,
	data: any = {},
	options: AxiosRequestConfig = {},
	isAbort = false
): Promise<ResponseAPI> => {
	const abortController = new AbortController()

	options.headers = options.headers || {}
	options.headers.Accept = 'application/json'
	options.headers['Access-Control-Allow-Credentials'] = 'true'

	let configs: AxiosRequestConfig = {
		method: method,
		url: url,
		headers: options.headers,
		signal: abortController.signal,
	}

	if (method.toLowerCase() === 'get') {
		configs.params = data
	} else {
		configs.data = data
	}

	if (isAbort) {
		abortController.abort()
		throw new Error('Request aborted.')
	}

	return axios(configs)
		.then((response: AxiosResponse<ResponseAPI>) => {
			const data = response.data as ResponseAPI
			// const dataResponse = data.data
			// return response.data
			return data
		})
		.catch((err) => {
			if (err.response && err.response.status === 401) {
				throw new Error('Unauthorized')
			}

			let throwErr: any = { data: {} }

			if (err.response && err.response.data) {
				throwErr.data = err.response.data
			}
			throwErr.data.status = err.response.status
			throw throwErr
		})
}

export default APIRequest
