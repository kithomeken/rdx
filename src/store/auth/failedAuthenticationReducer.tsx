import { Navigate } from "react-router"
import ConstantsRegistry from "../../global/ConstantsRegistry"
import CookieServices from "../../services/CookieServices"

const failedAuthenticationReducer = (action: any) => {
    switch (action.type) {
        case 'REVOKE_AUTH_ACCESS_':
            // Revoke authentication access
            const cookieNameForAccountName = ConstantsRegistry.cookieNameForAccountName()
            const cookieNameForAccountEmail = ConstantsRegistry.cookieNameForAccountEmail()
            const cookieNameForSanctumToken = ConstantsRegistry.cookieNameForSanctumToken()

            CookieServices.remove(cookieNameForAccountName)
            CookieServices.remove(cookieNameForAccountEmail)
            CookieServices.remove(cookieNameForSanctumToken)

            return <Navigate replace to="/auth/sign-in" />
    }
}

export default failedAuthenticationReducer