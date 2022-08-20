/*
 * Standard authenticated routes accessible 
 * By all account types, provided that they 
 * are authenticated.
*/

import { Navigate, Outlet, useLocation } from "react-router-dom";

import Auth from "./Auth";
import { TopNavigation } from "../../components/standard/TopNavigation";

export default function StandardAuthenticatedRoutes() {
    const location: any = useLocation()
    const currentLocation = location.pathname
    
    if (!Auth.isAuthenticated()) {
        return <Navigate to="/auth/sign-in" state={{ from: currentLocation }} replace />;
    }

    const marginTop = {marginTop: '64px'}
    const postAuth = location.state?.from

    return (
        <div>
            {
                postAuth ? (
                    <Outlet />
                ) : (
                    <div className="flex h-screen">
                        
                        <TopNavigation />
        
                        <div className="flex flex-col w-full mb-5">
                            <div className="w-full overflow-y-auto">
                                <div className="kiOAkj" style={marginTop}>
        
                                    <Outlet />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
