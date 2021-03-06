import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import swal from 'sweetalert';
import { useCountries } from 'use-react-countries'

import { API_MEDIA_DOMAIN_PREFIX } from "../../../../api/ApiRegistry";
import { COMPANY_GROUP_LOGO_REMOVAL_API_ROUTE, COMPANY_GROUP_VIEW_API_ROUTE } from "../../../../api/ApiRoutes"
import BreadCrumbs from "../../../../components/settings/BreadCrumbs"
import Header from "../../../../components/settings/Header"
import HeaderParagraph from "../../../../components/settings/HeaderParagraph"
import { HEADER_SECTION_BG } from "../../../../global/ConstantsRegistry"
import DateFormating from "../../../../lib/hooks/DateFormating"
import { generalRoutes } from "../../../../routes/settings/generalRoutes";
import HttpServices from "../../../../services/HttpServices"
import EmptyResultsReturned from "../../../errors/EmptyResultsReturned"
import Error500 from "../../../errors/Error500"
import EditCompanyGroup from "./EditCompanyGroup";
import PointsOfContactTab from "./PointsOfContactTab"
import ProductsTab from "./ProductsTab"
import UploadCompanyLogo from "./UploadLogoModal"

const CompanyView = () => {
    const [state, setstate] = useState({
        data: {
            name: '',
            logo: '',
            domain: '',
            deleted_at: '',
            description: '',
            created_at: '',
            country: '',
            country_name: '',
            country_code: '',
            orgnztn_country: '',
            contacts: '',
            products: '',
        },
        tabStatus: {
            poc: 'pending',
            products: 'pending',
        },
        show: {
            uploadModal: false,
            amendDetails: false,
        },
        activeTab: 'poc',
        status: 'pending',
        requestFailed: '',
        requestSucceeded: '',
    })

    const showButton = false
    const params = useParams();
    const pageTitle = "Company Details"
    const { countries } = useCountries()
    const COMPANY_GROUPS: any = (generalRoutes.find((routeName) => routeName.name === 'CMPNY'))?.path

    const breadCrumb = [
        { linkItem: true, title: "General Settings", url: "" },
        { linkItem: true, title: "Company Groups", url: COMPANY_GROUPS },
        { linkItem: false, title: pageTitle },
    ]

    function fetchCompanyDetailsWithSetState() {
        let { show } = state
        show.amendDetails = false
        
        setstate({
            ...state, show,
            status: 'pending',
        })

        fetchCompanyDetailsApiCall()
    }

    async function fetchCompanyDetailsApiCall() {
        try {
            const companyId = params.uuid
            const response: any = await HttpServices.httpGet(COMPANY_GROUP_VIEW_API_ROUTE + '/' + companyId)

            let { data } = state
            let status = state.status

            data = response.data.data
            status = 'fulfilled'
            // data.country_name = getCountryByNameOrShortName(response.data.data.country).name
            // data.country_code = getCountryByNameOrShortName(response.data.data.country).countryCallingCodes[0]

            console.log(data);
            

            setstate({
                ...state, data, status
            })
        } catch (e) {
            console.warn(e);
            let status = state.status
            status = 'rejected'

            setstate({
                ...state, status
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

    const activateTab = (tabName: any) => {
        setstate({
            ...state,
            activeTab: tabName
        })
    }

    const updateTabDataState = (tabName: any, dataFromTab: any) => {
        let { data } = state
        data[tabName] = dataFromTab

        setstate({
            ...state, data
        })
    }

    const updateTabStatus = (tabName: any, status: any) => {
        let { tabStatus } = state
        tabStatus[tabName] = status

        setstate({
            ...state, tabStatus
        })
    }

    const loadRespectiveTab = (tabName = 'poc') => {
        switch (tabName) {
            case 'poc':
                return <PointsOfContactTab
                    orgnztn_country={state.data.orgnztn_country}
                    updateTabDataState={updateTabDataState}
                    updateTabStatus={updateTabStatus}
                    status="fulfilled"
                    data={state.data.contacts}
                    companyId={params.uuid}
                />

            case 'products':
                return <ProductsTab
                    updateTabDataState={updateTabDataState}
                    updateTabStatus={updateTabStatus}
                    status={state.tabStatus.products}
                    data={state.data.products}
                    companyId={params.uuid}
                />

            default:
                return null
        }
    }

    const showOrHideUploadLogoModal = () => {
        let { show } = state
        show.uploadModal = !state.show.uploadModal

        setstate({
            ...state, show
        })
    }

    const showOrHideAmendDetailsModal = () => {
        let { show } = state
        show.amendDetails = !state.show.amendDetails

        setstate({
            ...state, show
        })
    }

    const updateCompanyLogoState = (logo: any, _fromModal?: any) => {
        let { data } = state
        data.logo = logo

        if (_fromModal !== null && _fromModal !== undefined) {
            showOrHideUploadLogoModal()
        }

        setstate({
            ...state, data
        })
    }

    const removeCompanyLogoHandler = async () => {
        swal({
            title: "Are you sure?",
            text: "Do you wish to remove the company's logo?",
            dangerMode: true,
            buttons: ["Cancel", "Proceed"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    removeCompanyLogoApiCall()
                }
            });
    }

    const removeCompanyLogoApiCall = async () => {
        let { requestFailed }: any = state

        try {
            let formData = new FormData()
            formData.append("company_uuid", params.uuid)

            const response: any = await HttpServices.httpPost(COMPANY_GROUP_LOGO_REMOVAL_API_ROUTE, formData)

            if (response.data.success) {
                updateCompanyLogoState(null)
            } else {
                requestFailed = true
            }
        } catch (error) {
            requestFailed = true
        }

        setstate({
            ...state, requestFailed,
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                {
                    state.status === 'fulfilled' ? (
                        <title>{state.data.name} - {pageTitle}</title>
                    ) : (
                        <title>{pageTitle}</title>
                    )
                }
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
                                            <div className="w-10/12 flex align-middle px-4">
                                                <div className="w-8/12 flex align-middle">
                                                    <p className="text-3xl mb-0">
                                                        {state.data.name}
                                                    </p>

                                                    <div className="w-10 ml-4 flex align-middle justify-center">
                                                        <button type="button" className={`inline-flex items-center p-1 px-2 ml-3 border-0 rounded text-sm text-blue-500 bg-white hover:bg-gray-50 hover:underline hover:border-0 focus:outline-none`} onClick={showOrHideAmendDetailsModal}>
                                                            <span className="text-sm">
                                                                Edit
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-10/12 pt-2 flex">
                                                {/* Company details half */}
                                                <div className="w-5/12 px-4 border-r">
                                                    <p className="text-sm mb-3 text-gray-500">
                                                        {state.data.description}
                                                    </p>

                                                    {countries.map((country: any, index: any) => (
                                                        <span key={index}>
                                                            {
                                                                (state.data.country) === country.name ? (
                                                                    <span className="flex items-center align-middle mb-4" key={index}>
                                                                        <span className="flex-shrink-0 h-5 w-4 rounded">{country.emoji}</span>
                                                                        <span className="ml-3 h-5 text-sm text-gray-700 truncate">{country.name}</span>
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </span>
                                                    ))}

                                                    {
                                                        state.data.domain === null || state.data.domain === undefined ? (
                                                            <p className="text-blue-500 text-sm mb-4"  onClick={showOrHideAmendDetailsModal}>
                                                                <span className="cursor-pointer">
                                                                    <span className="fas fa-plus mr-2"></span>
                                                                    Add company domain
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            <div className="w-full mb-4">
                                                                <a target="blank" href={state.data.domain} className="text-sm form-group mb-3 hover:underline text-blue-500">
                                                                    {state.data.domain}
                                                                </a>
                                                            </div>
                                                        )
                                                    }

                                                    <div className="form-group rounded border border-orange-400 bg-amber-100 py-3 px-4">
                                                        <div className="flex items-center align-middle text-orange-500">
                                                            <i className="fad fa-exclamation-triangle fa-lg text-orange-400"></i>
                                                            <span className="text-sm pl-3">
                                                                Company currently has no raised tickets under it's wings...
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center align-middle text-xs mb-3 text-gray-500">
                                                        <span className="fal fa-clock"></span>

                                                        <span className="ml-2">
                                                            <span className="mr-1">Created on: </span>
                                                            <DateFormating dateString={state.data.created_at} />
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Company logo half */}
                                                <div className="w-7/12 px-4">
                                                    <div className="w-full flex">
                                                        {
                                                            state.data.logo !== null && state.data.logo !== undefined ? (
                                                                <div className="w-full">
                                                                    <div className="bg-gray-100 rounded mr-4 h-44 mb-3 flex flex-col justify-center">
                                                                        {
                                                                            // TODO: Set special image api link
                                                                        }
                                                                        <img src={`${API_MEDIA_DOMAIN_PREFIX}/company/${state.data.logo}`} className="form-group h-36 m-auto rounded text-sm" alt={`${state.data.name} Company Logo`} />
                                                                    </div>

                                                                    <p className="text-red-500 text-xs mb-4">
                                                                        <span className="cursor-pointer" onClick={removeCompanyLogoHandler}>
                                                                            Remove Company Logo
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            ) : null
                                                        }

                                                        <div className="w-60">
                                                            <div className="h-44 border-2 border-gray-400 border-dashed rounded-md flex flex-col justify-center">
                                                                <div className="space-y-1 text-center flex-col align-middle">
                                                                    <svg
                                                                        className="mx-auto h-12 w-12 text-slate-400"
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

                                                                    <span className="text-xs text-gray-500">Upload company logo,</span>
                                                                    <div className="text-xs w-full m-0 text-gray-600">
                                                                        <label
                                                                            className="relative cursor-pointer bg-white rounded-md text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                                        >
                                                                            <span onClick={showOrHideUploadLogoModal}>Click to Browse</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-10/12 pb-3 flex flex-row">
                                                <div className="w-auto cursor-pointer" onClick={() => activateTab('poc')}>
                                                    <button className={classNames(
                                                        state.activeTab === 'poc' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Points Of Contact</span>
                                                    </button>
                                                </div>

                                                <div className="w-auto cursor-pointer" onClick={() => activateTab('products')}>
                                                    <button className={classNames(
                                                        state.activeTab === 'products' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Products Subscribed</span>
                                                    </button>
                                                </div>

                                                <div className="w-auto cursor-pointer" /* onClick={() => activateTab('complementary')} */>
                                                    <button className={classNames(
                                                        state.activeTab === 'client' ? 'text-green-700 border-b-2 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 border-b-2',
                                                        "text-sm items-center block p-2 px-3 rounded-t rounded-b-none"
                                                    )}>
                                                        <span className="lolrtn robot">Client Accounts</span>
                                                    </button>
                                                </div>

                                                <div className="flex-grow border-b-2">

                                                </div>
                                            </div>

                                            <div className="w-10/12 pb-6 px-3">
                                                {loadRespectiveTab(state.activeTab)}
                                            </div>

                                            <UploadCompanyLogo
                                                companyId={params.uuid}
                                                show={state.show.uploadModal}
                                                showOrHideModal={showOrHideUploadLogoModal}
                                                updateCompanyLogoState={updateCompanyLogoState}
                                            />

                                            <EditCompanyGroup
                                                companyId={params.uuid}
                                                stateFromParent={state.data}
                                                show={state.show.amendDetails}
                                                showOrHideModal={showOrHideAmendDetailsModal}
                                                reloadFetchData={fetchCompanyDetailsWithSetState}
                                            />
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