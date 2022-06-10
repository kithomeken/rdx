import React from 'react'
import { Transition } from '@headlessui/react'

export default function ErrorBanner({ message }: { message: any }) {
    return (
        <React.Fragment>
            <Transition
                show={true}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="bg-red-100 rounded drop-shadow">
                    <div className="mx-auto py-2 px-2 sm:px-6 lg:px-4">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex items-center align-middle">
                                    <i className="fad fa-lg fa-exclamation-circle text-red-500"></i>
                                </span>

                                <p className="ml-3 font-medium text-red-500 text-sm truncate">
                                    <span className="md:hidden"> {message} </span>
                                    <span className="hidden md:inline"> {message} </span>
                                </p>
                            </div>

                            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                <button type="button" className="-mr-1 flex p-1 rounded-md text-red-400 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}