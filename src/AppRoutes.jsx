import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import ScrollToTop from "./components/scrollToTop";

const InboxPage = lazy(() => import("./pages/inbox/index.jsx"));
const CustomersPage = lazy(() => import("./pages/customers/index.jsx"));
const ReportsPage = lazy(() => import("./pages/reports/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = () => {
    const location = useLocation();

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loading />} key={location.pathname}>
                <Routes location={location}>
                    <Route element={<Navigate replace to="/inbox" />} path="/" />
                    <Route element={<InboxPage />} path="/inbox" />
                    <Route element={<CustomersPage />} path="/customers" />
                    <Route element={<ReportsPage />} path="/reports" />
                    <Route element={<NotFoundPage />} path="*" />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
