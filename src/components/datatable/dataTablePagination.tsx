import React, { useEffect, useState, useRef } from 'react'
import { ResponseDataTable } from './dataTable'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Column } from './dataTableHeader'

export interface PaginationPayload {
	start: number
	length: number
	field: string
	sort: string
	search: string
	searchCol: string
}

type TablePaginationProps = {
	columns: Column[]
	pagination: ResponseDataTable<object>
	onPaginationDataSend: (data: PaginationPayload) => void
}

const TablePagination: React.FC<TablePaginationProps> = ({
	columns,
	pagination,
	onPaginationDataSend,
}) => {
	const [currentPage, setCurrent] = useState<number>(pagination.page)
	const [lengthPage, setLength] = useState<number>(pagination.length)
	const [numberOfPages, setPages] = useState<number>(1)
	const [payloadToSend, setPayload] = useState<PaginationPayload>({
		start: pagination.page ? (pagination.page - 1) * pagination.length : 0,
		length: pagination.length ? pagination.length : 3,
		field: 'created_at',
		sort: 'desc',
		search: pagination.searchKeyword,
		searchCol: pagination.searchColumn,
	})

	const [renderPage, setRender] = useState<JSX.Element[]>()

	const [firstNumber, setFirst] = useState<number>(1)
	const [secondNumber, setSecond] = useState<number>(3)

	const btnPrev = useRef<HTMLButtonElement>(null)
	const btnNext = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (pagination) {
			let calcPages = pagination.totalRecords / payloadToSend.length
			let totalPages = Math.ceil(calcPages)

			const calcSecondNumber = (pagination.length * pagination.page) | 0
			const viewSecondNumber =
				calcSecondNumber > pagination.totalRecords
					? pagination.totalRecords
					: calcSecondNumber
			setSecond(viewSecondNumber)

			const viewFirstNumber =
				(viewSecondNumber - pagination?.data?.length) | 0
			setFirst(viewFirstNumber + 1)

			onPaginationDataSend(payloadToSend)
			setLength(pagination.page)
			setPages(Math.ceil(calcPages))
		}
	}, [pagination, payloadToSend])

	useEffect(() => {
		let start = currentPage - 2
		let end = currentPage + 2

		if (start <= 0) {
			start = 1
			end = 5
		}

		if (end >= numberOfPages) {
			start = numberOfPages - 4 <= 0 ? 1 : numberOfPages - 4
			end = numberOfPages
		}

		const renderPagination: JSX.Element[] = []
		for (let index = start; index <= end; index++) {
			let pageNumber = index
			renderPagination.push(
				<button
					key={`page-${index}`}
					onClick={(e) => onChangePage(e, pageNumber)}
					className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
						pageNumber === currentPage
							? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
							: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
					}`}
				>
					{pageNumber}
				</button>
			)
		}

		setRender(renderPagination)
	}, [currentPage, numberOfPages])

	const triggerChangePage = (int: number) => {
		const num = int - 1
		const start = num !== 0 ? num * payloadToSend.length : num
		setPayload({ ...payloadToSend, start: start })
	}

	const onChangePage = (
		e: React.MouseEvent<HTMLButtonElement>,
		pageNumber: number
	) => {
		setCurrent(pageNumber)
		triggerChangePage(pageNumber)
	}

	const triggerNextPrevPage = (
		e: React.MouseEvent<HTMLButtonElement>,
		type: 'next' | 'prev'
	) => {
		let curr = type === 'next' ? currentPage + 1 : currentPage - 1

		setCurrent(curr)
		triggerChangePage(curr)

		if (type === 'next') {
			btnNext.current?.blur()
		} else {
			btnPrev.current?.blur()
		}
	}

	const onChangeSelectCounter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = parseInt(e.target.value)

		setPayload({ ...payloadToSend, start: 0, length: value })
	}

	return (
		<tr>
			<td colSpan={columns.length}>
				<div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
					<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
						<div className="flex">
							<div className="mr-2">
								<select
									className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
									onChange={onChangeSelectCounter}
									defaultValue={lengthPage}
								>
									<option value="3">3</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
							</div>
							<div className="flex items-center h-auto">
								<p className="m-auto text-sm text-gray-700">
									Showing{' '}
									<span className="font-medium">
										{firstNumber}
									</span>{' '}
									to{' '}
									<span className="font-medium">
										{secondNumber}
									</span>{' '}
									of{' '}
									<span className="font-medium">
										{pagination.totalRecords}
									</span>{' '}
									results
								</p>
							</div>
						</div>
						<div>
							<nav
								className="isolate inline-flex -space-x-px rounded-md shadow-sm"
								aria-label="Pagination"
							>
								<button
									onClick={(e) =>
										triggerNextPrevPage(e, 'prev')
									}
									className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
								>
									<span className="sr-only">Previous</span>
									<ChevronLeftIcon
										className="h-5 w-5"
										aria-hidden="true"
									/>
								</button>
								{renderPage}
								<button
									onClick={(e) =>
										triggerNextPrevPage(e, 'next')
									}
									className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
								>
									<span className="sr-only">Next</span>
									<ChevronRightIcon
										className="h-5 w-5"
										aria-hidden="true"
									/>
								</button>
							</nav>
						</div>
					</div>
				</div>
			</td>
		</tr>
	)
}

export default TablePagination
