import { createRoot } from "react-dom/client";
import { OverlayScrollbars } from "overlayscrollbars";
import { BrowserRouter } from "react-router-dom";
import "overlayscrollbars/overlayscrollbars.css";
import App from "./App.jsx";
import "./index.css";

OverlayScrollbars(document.body, {
    scrollbars: {
        theme: "os-theme-relay",
        autoHide: "move",
        autoHideSuspend: false,
    },
});

createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
    </BrowserRouter>,
);
