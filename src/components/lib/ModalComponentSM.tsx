import { Transition, Dialog } from "@headlessui/react"
import React, { Fragment } from "react"
import { toast } from "react-toastify"

export const ModalComponentSM = ({ show, showOrHideModal, title, description, onFormSubmitHandler, isPostingForm, formComponents, actionButton, }:
    { show: any, showOrHideModal: any, title: any, description: any, onFormSubmitHandler: any, isPostingForm: boolean, formComponents: any, actionButton: { before: any, after: any } }
) => {
    const checkIfFormIsPostingData = () => {
        if (!isPostingForm) {
            showOrHideModal()
            return
        }

        // Prevent dismissing if the form is positing data
        let toastText = 'Cannot dismiss as the current operation is still in progress'

        toast.warning(toastText, {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={checkIfFormIsPostingData}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                            <form className="rounded-md shadow-none space-y-px" onSubmit={onFormSubmitHandler}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="w-full">
                                        <div className="sm:col-span-8 lg:col-span-7 mb-3">
                                            <h2 className="text-xl text-emerald-500 sm:pr-12">
                                                {title}
                                            </h2>
                                        </div>

                                        <p className="text-sm mb-3 text-gray-700">
                                            {description}
                                        </p>

                                        {
                                            formComponents
                                        }
                                    </div>
                                </div>

                                <div className="bg-gray-100 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <div className="w-12/12 space-y-px">
                                        <div className="flex flex-row-reverse items-center align-middle">
                                            <button type="button" className="w-full inline-flex justify-center text-sm rounded-md border-0 border-transparent shadow-none px-3 py-1 bg-inherit text-gray-600 hover:bg-gray-200 sm:ml-3 sm:w-auto sm:text-sm" onClick={checkIfFormIsPostingData}>
                                                Cancel
                                            </button>

                                            {
                                                isPostingForm ? (
                                                    <button type="button" className="w-full inline-flex cursor-not-allowed justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-emerald-600 text-white sm:ml-3 sm:w-auto sm:text-sm disabled:bg-emerald-600" disabled={true}>
                                                        <span>
                                                            <span className="left-0 inset-y-0 flex items-center">
                                                                <span className="pr-2">
                                                                    {actionButton.after}
                                                                </span>

                                                                <span className="w-5 h-5">
                                                                    <i className="fad fa-spinner-third fa-lg fa-spin"></i>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="w-full inline-flex justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm">
                                                        {actionButton.before}
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}