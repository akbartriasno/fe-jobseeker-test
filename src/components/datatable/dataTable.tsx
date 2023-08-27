import React from 'react'
import TableHeader, { Column } from './dataTableHeader'
import Loader from '../utility/loader'
import TableRowData from './dataTableRowData'
import TablePagination, { PaginationPayload } from './dataTablePagination'

export interface ResponseDataTable<T> {
	page: number
	length: number
	totalRecords: number
	totalDisplayRecords: number
	searchKeyword: string
	searchColumn: string
	data: T[]
}

type DataTableProps = {
	columns: Column[]
	data: ResponseDataTable<object>
	baseUrl: string
	onDeleteDataReceived: (id: string) => void
}

const DataTable: React.FC<DataTableProps> = ({
	columns,
	data,
	baseUrl,
	onDeleteDataReceived,
}) => {
	const anyData = data.data ? data.data : []

	return (
		<>
			<tbody className="bg-white divide-y divide-gray-200">
				{anyData.length > 0 ? (
					data.data.map((item: object, idx: number) => (
						<TableRowData
							key={idx}
							columns={columns}
							data={item}
							baseUrl={baseUrl}
							onDeleteDataSend={onDeleteDataReceived}
						/>
					))
				) : (
					<tr>
						<td colSpan={columns.length} className="p-6">
							{/* <Loader /> */}
						</td>
					</tr>
				)}
			</tbody>
		</>
	)
}

export default DataTable
