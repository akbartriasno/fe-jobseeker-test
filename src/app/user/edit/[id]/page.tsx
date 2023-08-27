'use client'

import React from 'react'
import UsersForm from '@/components/users/users-form'
import Link from 'next/link'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

const EditUser = ({ params }: { params: { id: string } }) => {
	const idData = params.id

	return (
		<main className="flex-1">
			<div className="py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-2xl font-semibold text-gray-900">
						Edit User
					</h1>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<div className="py-4">
						<div className="text-right w-full mb-4">
							<Link
								type="button"
								href="/"
								className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500	"
							>
								<ArrowUturnLeftIcon
									className="-ml-1 mr-2 h-5 w-5"
									aria-hidden="true"
								/>
								Back to List
							</Link>
						</div>
						<UsersForm id={idData} />
					</div>
				</div>
			</div>
		</main>
	)
}

export default EditUser
