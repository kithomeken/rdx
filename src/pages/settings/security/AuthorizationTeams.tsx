import { format } from "date-fns"
import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

import BreadCrumbs from "../../../components/settings/BreadCrumbs"
import Header from "../../../components/settings/Header"
import HeaderParagraphLarge from "../../../components/settings/HeaderParagraphLarge"
import { HEADER_SECTION_BG } from "../../../global/ConstantsRegistry"
import { usePromiseEffect } from "../../../lib/hooks/usePromiseEffect"
import { securityRoutes } from "../../../routes/settings/securityRoutes"
import HttpServices from "../../../services/HttpServices"
import Error500 from "../../errors/Error500"
import { CreateAuthGroup } from "./CreateAuthGroup"

const AuthorizationTeams = () => {
    const [state, setstate] = useState({
        show: false,
        isLoading: true,
        requestFailed: false,
    })

    const groupOrTeam = 'Team'
    const pageTitle = "Authorization " + groupOrTeam
    const thisPageRoutes = securityRoutes[0].path

    // Header button
    const buttonIcon = true
    const showButton = true
    const actionButton = true
    const buttonTitle = "Create Auth Team"
    const iconType = "fas fa-plus-circle"

    const breadCrumb = [
        { linkItem: true, title: "Security", url: thisPageRoutes },
        { linkItem: false, title: pageTitle },
    ]

    const authTeamsUsePromiseResponse = usePromiseEffect(async () => {
        const response: any = await HttpServices.httpGet('portal/a/site-master/security/auth-teams')

        if (response.status !== 200) {
            setstate({
                ...state,
                requestFailed: true
            })
            throw new Error("Something went wrong when fetching authorization groups...");
        }

        return response.data
    }, [])

    const showOrHideModal = () => {
        setstate({
            ...state, show: !state.show
        })
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
                    actionButton={actionButton}
                    actionEvent={showOrHideModal}
                    buttonTitle={buttonTitle}
                    buttonIcon={buttonIcon}
                    iconType={iconType}
                />

                <HeaderParagraphLarge title="Organize your support agents into specialized teams and make it easier to issue out access rights. Create a team and specify the actions that your agents can perform. To start you off, we've automatically created a few teams with the default badge tag. Go ahead and create a new team for your agents." />
            </div>

            <div className="w-full px-12 form-group">
                {
                    authTeamsUsePromiseResponse.status === 'rejected' ? (
                        <div className="w-full form-group">
                            <Error500 />
                        </div>
                    ) : authTeamsUsePromiseResponse.status === 'fulfilled' ? (
                        <div className="w-full form-group">
                            {
                                authTeamsUsePromiseResponse.value.map((authTeam: any, index: any) => {
                                    const createdOn = new Date(authTeam.created_at);

                                    return (
                                        <div className="w-full mb-3 py-3 px-4 rounded-md border hover:shadow" key={index}>
                                            <div className="flex mb-2 items-center">
                                                <div className="basis-3/4">
                                                    <Link to={`/a/default/settings/security/auth-teams/${authTeam.uuid}`} className="text-green-500 block hover:underline">
                                                        {authTeam.name}
                                                    </Link>

                                                    <span className="text-sm text-gray-600 block">
                                                        {authTeam.description}
                                                    </span>
                                                </div>

                                                <div className="basis-1/4">
                                                    <Link to="/auth/forgot-password" className="font-medium text-center mr-3 float-right text-blue-600 hover:text-blue-800 flex items-center">
                                                        <span className="fad fa-pencil block fa-sm mr-2"></span>

                                                        <span className="font-small">
                                                            Edit {groupOrTeam}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="lg:basis-2/4">
                                                    {
                                                        authTeam.default === 'N' ? (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 mr-3 text-xs leading-none text-gray-700 bg-gray-300 rounded">
                                                                Default
                                                            </span>
                                                        ) : null
                                                    }

                                                    {
                                                        authTeam.access_type === 'A' ? (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 mr-3 text-xs leading-none text-indigo-700 bg-indigo-300 rounded">
                                                                All Time Access
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 mr-3 text-xs leading-none text-indigo-700 bg-indigo-300 rounded">
                                                                Limited Time Access
                                                            </span>
                                                        )
                                                    }

                                                    <span className="text-xs text-gray-400 mb-2">
                                                        <span className="text-gray-600">
                                                            Ticket Access:
                                                        </span>

                                                        <span className="ml-2">
                                                            {authTeam.ticket_access === 'GLB' ? 'Global Access' : 'Limited Access'}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="basis-2/4">
                                                    <span className="text-xs text-gray-400 mb-2 float-right mr-3">
                                                        <span className="text-gray-600">
                                                            Created on:
                                                        </span>

                                                        <span className="ml-2">
                                                            {format(createdOn, "MMMM do, yyyy")}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col align-middle mt-24 w-full h-16">
                            <span className="fad text-green-500 fa-spinner-third fa-2x m-auto block fa-spin"></span>
                        </div>
                    )
                }
            </div>

            <CreateAuthGroup
                show={state.show}
                showOrHideModal={showOrHideModal}
            />

        </React.Fragment>
    )
}

export default AuthorizationTeams