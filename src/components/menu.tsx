'use client'

import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
	InformationCircleIcon,
	HomeIcon,
	Bars4Icon,
	UsersIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ClassNames } from './utility/utils'

interface NavigationItem {
	name: string
	icon: React.ComponentType<React.SVGAttributes<SVGElement>>
	path: string
	current: string | null
}
const navigation: NavigationItem[] = [
	{ name: 'Dashboard', icon: HomeIcon, path: '/', current: null },
	{ name: 'Profile', icon: UsersIcon, path: '/profile', current: 'profile' },
	{
		name: 'About',
		icon: InformationCircleIcon,
		path: '/about',
		current: 'about',
	},
]

const Menu = () => {
	const activeSegment = useSelectedLayoutSegment()
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 flex z-40 md:hidden"
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
							<Transition.Child
								as={Fragment}
								enter="ease-in-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in-out duration-300"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="absolute top-0 right-0 -mr-12 pt-2">
									<button
										type="button"
										className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										onClick={() => setSidebarOpen(false)}
									>
										<span className="sr-only">
											Close sidebar
										</span>
										<XMarkIcon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</button>
								</div>
							</Transition.Child>
							<div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
								<div className="flex-shrink-0 flex items-center px-4">
									<Image
										width="0"
										height="0"
										sizes="100vw"
										className="h-8 w-auto"
										src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
										alt="Workflow"
									/>
								</div>
								<nav className="mt-5 px-2 space-y-1">
									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.path}
											className={ClassNames(
												activeSegment === item.current
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'group flex items-center px-2 py-2 text-base font-medium rounded-md'
											)}
											onClick={() =>
												setSidebarOpen(false)
											}
										>
											<item.icon
												className={ClassNames(
													activeSegment ===
														item.current
														? 'text-gray-300'
														: 'text-gray-400 group-hover:text-gray-300',
													'mr-4 flex-shrink-0 h-6 w-6'
												)}
												aria-hidden="true"
											/>
											{item.name}
										</Link>
									))}
								</nav>
							</div>
							<div className="flex-shrink-0 flex bg-gray-700 p-4">
								<a
									href="#"
									className="flex-shrink-0 group block"
								>
									<div className="flex items-center">
										<div>
											<Image
												width="0"
												height="0"
												sizes="100vw"
												src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												className="inline-block h-10 w-10 rounded-full"
												alt=""
											/>
										</div>
										<div className="ml-3">
											<p className="text-base font-medium text-white">
												User Name
											</p>
											<p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
												More details...
											</p>
										</div>
									</div>
								</a>
							</div>
						</div>
					</Transition.Child>
					<div className="flex-shrink-0 w-14">
						{/* Force sidebar to shrink to fit close icon */}
					</div>
				</Dialog>
			</Transition.Root>

			<div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
				<div className="flex-1 flex flex-col min-h-0 bg-gray-800">
					<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
						<div className="flex items-center flex-shrink-0 px-4">
							<Image
								width="0"
								height="0"
								sizes="100vw"
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
								alt="Workflow"
							/>
						</div>
						<nav className="mt-5 flex-1 px-2 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.path}
									className={ClassNames(
										activeSegment === item.current
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
									)}
								>
									<item.icon
										className={ClassNames(
											activeSegment === item.current
												? 'text-gray-300'
												: 'text-gray-400 group-hover:text-gray-300',
											'mr-3 flex-shrink-0 h-6 w-6'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							))}
						</nav>
					</div>
					<div className="flex-shrink-0 flex bg-gray-700 p-4">
						<a
							href="#"
							className="flex-shrink-0 w-full group block"
						>
							<div className="flex items-center">
								<div>
									<Image
										width="0"
										height="0"
										sizes="100vw"
										className="inline-block h-9 w-9 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-white">
										User Name
									</p>
									<p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
										More Details...
									</p>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>

			<div className="md:pl-64 flex flex-col flex-1">
				<div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
					<button
						type="button"
						className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars4Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
			</div>
		</>
	)
}

export default Menu
