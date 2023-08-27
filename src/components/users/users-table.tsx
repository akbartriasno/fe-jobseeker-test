import React, { useRef, useState, useMemo } from 'react'
import isEqual from 'lodash.isequal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import APIRequest, { ResponseAPI } from '../api/api-request'
import { Column } from '../datatable/dataTableHeader'
import { PaginationPayload } from '../datatable/dataTablePagination'
import { ResponseDataTable } from '../datatable/dataTable'
import withDataTable from '../datatable/withDataTable'
import Loader from '../utility/loader'
import {
	PlusCircleIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const baseAPI = `${process.env.API_URL}candidate/`

const headerColumns: Column[] = [
	{ label: 'Name', dataKey: 'full_name', className: 'text-gray-900' },
	{ label: 'Email', dataKey: 'email', className: 'text-gray-500' },
	{ label: 'Phone', dataKey: 'phone_number', className: 'text-gray-500' },
	{
		label: 'Action',
		dataKey: 'id',
		className: 'text-gray-500',
		isButton: true,
	},
]

interface UserData {
	id: string
	full_name: string
	email: string
	phone_number: string
	createdDate: string
}

interface UsersResponse extends ResponseDataTable<UserData[]> {}

const UsersTable: React.FC = () => {
	const notif = withReactContent(Swal)
	const [dataSource, setDataSource] = useState<UsersResponse>(Object)
	const [loading, setLoading] = useState<boolean>(false)
	const prevPayloadRef = useRef<PaginationPayload | null>(null)

	const handlePaginationPayloadReceived = (data: PaginationPayload) => {
		if (!isEqual(prevPayloadRef.current, data)) {
			fetchData(data)
		}
	}

	const handleDeleteDataReceived = (id: string) => {
		const getName = dataSource.data.find((el) => (el as any).id == id)

		notif
			.fire({
				title: 'Delete Data',
				text: 'Are you sure to delete ' + (getName as any).name + ' ?',
				showCancelButton: true,
				cancelButtonText: `Cancel`,
				confirmButtonText: 'Yes, delete',
				confirmButtonColor: 'rgb(220 38 38)',
				showLoaderOnConfirm: true,
				allowOutsideClick: () => !Swal.isLoading(),
				preConfirm: async () => {
					return await APIRequest<ResponseAPI<null>>(
						'DELETE',
						baseAPI + `${id}`
					)
						.then((response: ResponseAPI<null>) => {
							return response
						})
						.catch((error) => {
							Swal.showValidationMessage(`Fail to Delete`)
						})
				},
			})
			.then(async (result) => {
				if (result.isConfirmed) {
					prevPayloadRef.current
						? fetchData(prevPayloadRef.current)
						: null
					Swal.fire('Deleted!', result.value?.message, 'success')
				}
			})
	}

	async function fetchData(payload: PaginationPayload) {
		setLoading(true)
		await APIRequest<ResponseAPI<UsersResponse>>('GET', baseAPI, payload)
			.then((response: ResponseAPI<UsersResponse>) => {
				const data = response.data
				if (data) {
					setDataSource(data)
					prevPayloadRef.current = payload
				}
			})
			.catch((error) => {
				console.log('error', error)
			})

		setLoading(false)
	}

	const UsersDataTable = useMemo(
		() =>
			withDataTable(
				'user',
				headerColumns,
				dataSource,
				handlePaginationPayloadReceived,
				handleDeleteDataReceived
			),
		[headerColumns, dataSource]
	)

	const [search, setSearch] = useState<string>('')
	const handleSearchInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target
		setSearch(value)
	}

	const [searchCol, setSearchCol] = useState<string>('')
	const handleSearchColChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target
		setSearchCol(value)
	}

	const onSubmitSearch = () => {
		const initPayload = prevPayloadRef.current
		if (initPayload != undefined) {
			initPayload.search = search
			initPayload.searchCol = searchCol

			fetchData(initPayload)
		}
	}

	return (
		<>
			<div className="grid grid-cols-8 gap-4">
				<div className="col-span-2">
					<input
						type="text"
						name="search"
						value={search}
						onChange={handleSearchInputChange}
						placeholder="Search here..."
						className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="col-span-1">
					<select
						name="searchCol"
						value={searchCol}
						onChange={handleSearchColChange}
						className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					>
						<option disabled={true} value="">
							Search by...
						</option>
						<option value="full_name">Name</option>
						<option value="email">Email</option>
						<option value="phone_number">Phone Number</option>
					</select>
				</div>
				<div className="col-span-1">
					<button
						onClick={onSubmitSearch}
						className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						<MagnifyingGlassIcon
							className="-ml-1 mr-2 h-5 w-5"
							aria-hidden="true"
						/>
						Find
					</button>
				</div>
				<div className="col-span-4">
					<div className="text-right w-full mb-4">
						<Link
							type="button"
							href="/user/add"
							className="inline-flex items-center px-4 py-2 border border-transparent shadow text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500	"
						>
							<PlusCircleIcon
								className="-ml-1 mr-2 h-5 w-5"
								aria-hidden="true"
							/>
							Add New Candidate
						</Link>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
						<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg relative">
							{loading ? (
								<div className="absolute inset-x-0 inset-y-0 bg-slate-300/25 z-10">
									<Loader />
								</div>
							) : null}
							<UsersDataTable />
						</div>
					</div>
				</div>
				<div></div>
			</div>
		</>
	)
}

export default UsersTable
