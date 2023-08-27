import React from 'react'
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Column } from './dataTableHeader'
import { useRouter } from 'next/navigation'

interface TableDataRowProps {
	baseUrl: string
	columns: Column[]
	data: object
	onDeleteDataSend: (id: string) => void
}

const TableRowData: React.FC<TableDataRowProps> = ({
	baseUrl,
	columns,
	data,
	onDeleteDataSend,
}) => {
	const router = useRouter()

	const handleEditButton = () => {
		router.push(baseUrl + '/edit/' + (data as any)['id'])
	}

	const handleDeleteButton = () => {
		onDeleteDataSend((data as any)['id'])
	}

	return (
		<tr>
			{columns.map((col, idxCol) => (
				<td key={idxCol} className="px-6 py-4 whitespace-nowrap">
					{col.isButton ? (
						<div>
							<button
								type="button"
								onClick={handleEditButton}
								className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
							>
								<PencilIcon
									className="h-4 w-4"
									aria-hidden="true"
								/>
							</button>
							&nbsp;
							<button
								type="button"
								onClick={handleDeleteButton}
								className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								<TrashIcon
									className="h-4 w-4"
									aria-hidden="true"
								/>
							</button>
						</div>
					) : (
						<div className={`text-md font-medium ${col.className}`}>
							{(data as any)[col.dataKey]}
						</div>
					)}
				</td>
			))}
		</tr>
	)
}

export default TableRowData
