import AppRoutes from "./AppRoutes.jsx";
import DialogLayer from "./components/dialogLayer";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Toasts from "./components/toasts";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.app}>
        <a className={styles.skipLink} href="#main-content">Skip to content</a>
        <Sidebar />
        <div className={styles.workspace}>
            <Header />
            <main className={styles.main} id="main-content"><AppRoutes /></main>
            <Footer />
        </div>
        <DialogLayer />
        <Toasts />
    </div>
);

export default App;
