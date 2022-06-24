import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { COMPANY_GROUP_VIEW_API_ROUTE } from "../../../../api/ApiRoutes"
import ApiServices from "../../../../api/ApiServices"
import BreadCrumbs from "../../../../components/settings/BreadCrumbs"
import Header from "../../../../components/settings/Header"
import HeaderParagraph from "../../../../components/settings/HeaderParagraph"
import { HEADER_SECTION_BG } from "../../../../global/ConstantsRegistry"
import DateFormating from "../../../../lib/hooks/DateFormating"
import HttpServices from "../../../../services/HttpServices"
import EmptyResultsReturned from "../../../errors/EmptyResultsReturned"
import Error500 from "../../../errors/Error500"

const CompanyView = () => {
    const [state, setstate] = useState({
        data: {
            contacts: '',
            name: '',
            logo: '',
            domain: '',
            deleted_at: '',
            description: '',
            created_at: '',
        },
        show: false,
        activeTab: 'poc',
        status: 'pending',
        requestFailed: '',
        requestSucceeded: '',
    })

    const showButton = false
    const FQDN = ApiServices.FQDN()
    const params = useParams();
    const pageTitle = "Company Details"

    const breadCrumb = [
        { linkItem: true, title: "General Settings", url: "" },
        { linkItem: true, title: "Company Groups", url: "" },
        { linkItem: false, title: pageTitle },
    ]

    function fetchCompanyDetailsWithSetState() {
        setstate({
            ...state,
            status: 'pending'
        })

        fetchCompanyDetailsApiCall()
    }

    async function fetchCompanyDetailsApiCall() {
        try {
            const companyId = params.uuid
            const apiDomain = ApiServices.apiDomain()
            const apiCall = apiDomain + COMPANY_GROUP_VIEW_API_ROUTE + '/' + companyId
            const response: any = await HttpServices.httpGet(apiCall)

            let { data } = state
            let status = state.status
            let show = state.show

            data = response.data.data
            status = 'fulfilled'

            setstate({
                ...state, data, status
            })
        } catch (e) {
            console.warn(e);
            let status = state.status
            let show = state.show

            status = 'rejected'
            show = false

            setstate({
                ...state, status, show
            })
        } finally {
            // Do nothing            
        }
    }

    React.useEffect(() => {
        fetchCompanyDetailsWithSetState();
    }, []);

    const classNames = (...classes: any[]) => {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <div className={`px-12 py-3 w-full ${HEADER_SECTION_BG} form-group mb-3`}>
                <BreadCrumbs breadCrumbDetails={breadCrumb} />

                <Header title={pageTitle}
                    showButton={showButton}
                />

                <HeaderParagraph title="View company details and add contact information" />
            </div>

            <div className="w-full px-12 form-group">
                <div className="w-12/12 mb-5">
                    {
                        state.status === 'rejected' ? (
                            <Error500 />
                        ) : state.status === 'fulfilled' ? (
                            <>
                                {
                                    (state.data === undefined || state.data === null) ? (
                                        <EmptyResultsReturned />
                                    ) : (
                                        <div>
                                            <div className="w-10/12 pt-2 flex">
                                                {/* Company details half */}
                                                <div className="w-5/12 px-4 border-r">
                                                    <p className="text-2xl mb-1">
                                                        {state.data.name}
                                                    </p>

                                                    <p className="text-sm mb-5 text-gray-500">
                                                        {state.data.description}
                                                    </p>

                                                    {
                                                        state.data.domain === null ? (
                                                            <p className="text-blue-500 text-sm mb-4">
                                                                <span className="cursor-pointer">
                                                                    <span className="fas fa-plus mr-2"></span>
                                                                    Add company domain
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            <div className="w-full mb-5">
                                                                <a target="blank" href={state.data.domain} className="text-sm form-group mb-3 hover:underline text-blue-500">
                                                                    {state.data.domain}
                                                                </a>
                                                            </div>
                                                        )
                                                    }

                                                    {/* <div className="w-full form-group">
                                                        <p className="text-sm mb-1">
                                                            Tickets raised tagged with company id
                                                        </p>

                                                        <p className="text-2xl mb-1">
                                                            0
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            Company group currently has no tickets raised under it's wings
                                                        </p>
                                                    </div> */}

                                                    <div className="form-group rounded border border-orange-400 bg-amber-100 py-3 px-4">
                                                        <div className="flex items-center align-middle text-orange-500">
                                                            <span className="text-xs pl-3">
                                                                No tickets have been raised by/for this company group
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-gray-500 flex items-center align-middle">
                                                        <i className="fal fa-clock"></i>
                                                        <span className="ml-1">
                                                            <span className="mr-1">Created on: </span>
                                                            <DateFormating dateString={state.data.created_at} />
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Company logo half */}
                                                <div className="w-7/12 px-4">
                                                    <div className="w-full flex">
                                                        <div className="w-full">
                                                            <div className="bg-gray-100 rounded mr-4 h-44 mb-3 flex flex-col justify-center">
                                                                <img src={`${FQDN}/uploads/company-logos/${state.data.logo}`} className="form-group h-36 m-auto rounded text-sm" alt={`${state.data.name} Company Logo`} height="200" />
                                                            </div>

                                                            <p className="text-red-500 text-sm mb-4">
                                                                <span className="cursor-pointer">
                                                                    <span className="fas fa-minus mr-2"></span>
                                                                    Remove company logo
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div className="w-60 ">
                                                            <div className="h-44 border-2 border-gray-400 border-dashed rounded-md flex flex-col justify-center">
                                                                <div className="space-y-1 text-center flex-col align-middle">
                                                                    <svg
                                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                                        stroke="currentColor"
                                                                        fill="none"
                                                                        viewBox="0 0 48 48"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <path
                                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>

                                                                    <span className="text-xs text-gray-500">Upload new company logo,</span>
                                                                    <div className="text-xs w-full m-0 text-gray-600">
                                                                        <label
                                                                            htmlFor="file-upload"
                                                                            className="relative cursor-pointer bg-white rounded-md text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                                        >
                                                                            <span>click to browse</span>
                                                                            <input id="file-upload" name="logo" type="file" /* onChange={onFileChangeHandler} */ className="sr-only" />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-10/12 pb-6 flex flex-row">
                                                <div className="w-auto cursor-pointer" /* onClick={() => activateTab('main')} */>
                                                    <button className={classNames(
                                                        state.activeTab === 'poc' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Points Of Contact</span>
                                                    </button>
                                                </div>

                                                <div className="w-auto cursor-pointer" /* onClick={() => activateTab('complementary')} */>
                                                    <button className={classNames(
                                                        state.activeTab === 'complementary' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Products Allocated</span>
                                                    </button>
                                                </div>

                                                <div className="w-auto cursor-pointer" /* onClick={() => activateTab('complementary')} */>
                                                    <button className={classNames(
                                                        state.activeTab === 'complementary' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Client Users</span>
                                                    </button>
                                                </div>

                                                <div className="flex-grow border-b-2">

                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        ) : (
                            <div className="flex flex-col align-middle mt-6 h-16">
                                <span className="fad text-green-500 fa-spinner-third fa-2x m-auto block fa-spin"></span>
                            </div>
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default CompanyView