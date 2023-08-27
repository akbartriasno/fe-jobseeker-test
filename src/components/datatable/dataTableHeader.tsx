import React from 'react'

export interface Column {
	label: string
	dataKey: string
	className?: string
	isButton?: boolean | false
}

const TableHeader: React.FC<{
	columns: Column[]
}> = ({ columns }) => {
	return (
		<thead className="bg-gray-100">
			<tr>
				{columns.map((column, index) => (
					<th
						key={index}
						scope="col"
						className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						{column.label}
					</th>
				))}
			</tr>
		</thead>
	)
}

export default TableHeader
