import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import ScrollToTop from "./components/scrollToTop";

const InboxPage = lazy(() => import("./pages/inbox/index.jsx"));

const AppRoutes = () => {
    const location = useLocation();

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loading />} key={location.pathname}>
                <Routes location={location}>
                    <Route element={<Navigate replace to="/inbox" />} path="/" />
                    <Route element={<InboxPage />} path="/inbox" />
                    <Route element={<Navigate replace to="/inbox" />} path="*" />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
