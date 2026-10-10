import { FiArrowLeft, FiArrowUpRight, FiInbox, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <main className={styles.notFound}>
        <div className={styles.art} aria-hidden="true"><span><FiMessageCircle /></span><i /><i /><i /></div>
        <p className={styles.code}>404 · THREAD NOT FOUND</p>
        <h1>This page is out of the queue.</h1>
        <p className={styles.description}>The link may have moved, or the conversation may no longer be available. Head back to the inbox and pick up where you left off.</p>
        <div className={styles.actions}><Link className={styles.primary} to="/inbox"><FiInbox aria-hidden="true" /> Open the inbox <FiArrowUpRight aria-hidden="true" /></Link><Link className={styles.secondary} to="/customers"><FiArrowLeft aria-hidden="true" /> Browse customers</Link></div>
        <span className={styles.support}>Need help? The Relay team is here for you.</span>
    </main>
);

export default NotFoundPage;
