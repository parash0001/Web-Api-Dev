import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { user, isInitialized } = useAuth();
    const location = useLocation();

    if (!isInitialized) return null; // or <LoadingSpinner />

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
