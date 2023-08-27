/* eslint-disable indent */
import React from 'react'
import DataTable, { ResponseDataTable } from './dataTable'
import TableHeader, { Column } from './dataTableHeader'
import TablePagination, { PaginationPayload } from './dataTablePagination'

const withDataTable = <P extends object>(
	baseUrl: string,
	columns: Column[],
	data: ResponseDataTable<object>,
	onPaginationDataReceived: (data: PaginationPayload) => void,
	onDeleteDataReceived: (id: string) => void,
) =>
	class WithPagination extends React.Component<P> {
		render() {
			return (
				<table className="min-w-full divide-y divide-gray-200">
					<TableHeader columns={columns} />

					<DataTable
						baseUrl={baseUrl}
						columns={columns}
						data={data}
						onDeleteDataReceived={onDeleteDataReceived}
					/>

					<tfoot className="relative">
						<TablePagination
							columns={columns}
							pagination={data}
							onPaginationDataSend={onPaginationDataReceived}
						/>
					</tfoot>
				</table>
			)
		}
	}

export default withDataTable
