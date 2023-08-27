import React, { useState, useEffect } from 'react'
import Loader from '../utility/loader'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import APIRequest, { ResponseAPI } from '../api/api-request'
import { useRouter } from 'next/navigation'
import Datepicker from 'react-tailwindcss-datepicker'

const baseAPI = `${process.env.API_URL}candidate/`

interface DataFill {
	full_name: string
	email: string
	phone_number: string
	dob: string
	pob: string
	gender: string
	year_exp: string | null
	last_salary: string | null
}

const defaultData: DataFill = {
	full_name: '',
	email: '',
	phone_number: '',
	dob: '',
	pob: '',
	gender: '',
	year_exp: '',
	last_salary: '',
}

interface ValueDate {
	startDate: string | null
	endDate: string | null
}

interface DataResponse extends DataFill {
	id: string
}

interface ErrorField {
	[key: string]: string[]
}

type UsersFormProps = {
	id?: string
}

const UsersForm: React.FC<UsersFormProps> = ({ id }) => {
	const router = useRouter()
	const [data, setData] = useState<DataFill>(defaultData)
	const [error, setError] = useState<ErrorField>()
	const [loading, setLoading] = useState<boolean>(true)
	const notif = withReactContent(Swal)

	const [valDatePicker, setValDatePicker] = useState<ValueDate>({
		startDate: null,
		endDate: null,
	})
	const handleValueDatePickerChange = (newValue: any) => {
		setValDatePicker(newValue)

		setData((prevData) => ({
			...prevData,
			dob: newValue.startDate,
		}))
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target

		setData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		dispatchData()
	}

	async function dispatchData() {
		const updatedData = id ? { ...data, id: id } : data
		const methodData = id ? 'PUT' : 'POST'
		await APIRequest<ResponseAPI<DataResponse>>(
			methodData,
			baseAPI,
			updatedData
		)
			.then((response: ResponseAPI<DataResponse>) => {
				const reset = defaultData
				const renderInfo: JSX.Element = (
					<p>
						{response.data?.full_name} <br />
						{response.data?.email}
					</p>
				)

				notif
					.fire({
						title: response.message,
						html: renderInfo,
						icon: 'success',
					})
					.then((result) => {
						if (result.isConfirmed) {
							router.push('/')
						}
					})

				setData(reset)
				// setError(reset)
			})
			.catch((error) => {
				const { status } = error.data
				if (status == 422) {
					console.log('err', error.data.errors)
					setError(error.data.errors)
				}
			})

		setLoading(false)
	}

	async function fetchData(idData: string) {
		await APIRequest<ResponseAPI<DataResponse>>('GET', baseAPI + idData)
			.then((response: ResponseAPI<DataResponse>) => {
				const result = response.data
				if (result) {
					setData(result)
					setValDatePicker({
						startDate: result.dob,
						endDate: result.dob,
					})
				}
			})
			.catch((error) => {
				const { status } = error.data
				if (status == 422) {
					setError(error.data)
				}
			})

		setLoading(false)
	}

	const renderErrors = (field: string): JSX.Element | null => {
		const errorElements = error?.[field]
			? error?.[field].map((itemsError: string, idx: number) => (
				<span
					key={field + idx}
					className="text-sm text-red-500 block"
				>
					{itemsError}
				</span>
			  ))
			: null
		return errorElements ? <>{errorElements}</> : null
	}

	useEffect(() => {
		id ? fetchData(id) : setLoading(false)
	}, [id])

	return (
		<div className="">
			<div className="space-y-6 sm:px-6 lg:px-0">
				<form onSubmit={handleSubmitForm}>
					<div className="shadow-lg sm:overflow-hidden sm:rounded-md relative">
						{loading ? (
							<div className="absolute inset-x-0 inset-y-0 bg-slate-300/25 z-10">
								<Loader />
							</div>
						) : null}
						<div className="space-y-6 bg-white py-6 px-4 sm:p-6 ">
							<div>
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									Candidate Information
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Fill in the required information
								</p>
							</div>

							<div className="grid grid-cols-6 gap-4">
								<div className="col-start-2 col-span-4">
									<label
										htmlFor="full_name"
										className="block text-sm font-medium text-gray-700"
									>
										Full name
									</label>
									<input
										type="text"
										name="full_name"
										onChange={handleInputChange}
										value={data.full_name}
										className={`mt-1 block w-full rounded-md border ${
											error?.full_name
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									/>
									{renderErrors('full_name')}
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="email-address"
										className="block text-sm font-medium text-gray-700"
									>
										Email address
									</label>
									<input
										type="text"
										name="email"
										onChange={handleInputChange}
										autoComplete="email"
										value={data.email}
										className={`mt-1 block w-full rounded-md border ${
											error?.email
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									/>
									{renderErrors('email')}
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="phone_number"
										className="block text-sm font-medium text-gray-700"
									>
										Phone Number
									</label>
									<input
										type="text"
										name="phone_number"
										onChange={handleInputChange}
										value={data.phone_number}
										className={`mt-1 block w-full rounded-md border ${
											error?.phone_number
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									/>
									{renderErrors('phone_number')}
								</div>

								<div className="col-start-2 col-span-4">
									<label className="block text-sm font-medium text-gray-700">
										Date of Birth
									</label>
									<Datepicker
										primaryColor={'indigo'}
										useRange={false}
										asSingle={true}
										value={valDatePicker}
										onChange={(e) =>
											handleValueDatePickerChange(e)
										}
										inputClassName={`mt-1 w-full rounded-md border ${
											error?.dob
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									/>
									{renderErrors('dob')}
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="pob"
										className="block text-sm font-medium text-gray-700"
									>
										Place of Birth
									</label>
									<input
										type="text"
										name="pob"
										onChange={handleInputChange}
										value={data.pob}
										className={`mt-1 block w-full rounded-md border ${
											error?.pob
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									/>
									{renderErrors('pob')}
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="gender"
										className="block text-sm font-medium text-gray-700"
									>
										Gender
									</label>
									<select
										name="gender"
										value={data.gender}
										onChange={handleGenderChange}
										className={`mt-1 block w-full rounded-md border ${
											error?.gender
												? 'border-red-300'
												: 'border-gray-300'
										} py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
									>
										<option>-</option>
										<option value="M">Male</option>
										<option value="F">Female</option>
									</select>
									{renderErrors('gender')}
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="year_exp"
										className="block text-sm font-medium text-gray-700"
									>
										Year Experience
									</label>
									<input
										type="text"
										name="year_exp"
										onChange={handleInputChange}
										value={data.year_exp as string}
										className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									/>
								</div>

								<div className="col-start-2 col-span-4">
									<label
										htmlFor="last_salary"
										className="block text-sm font-medium text-gray-700"
									>
										Last Salary
									</label>
									<input
										type="text"
										name="last_salary"
										onChange={handleInputChange}
										value={data.last_salary as string}
										className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="bg-gray-100 px-4 py-3 text-right sm:px-6">
							<button
								type="submit"
								className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default UsersForm
