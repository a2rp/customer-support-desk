import { useEffect } from "react";
import { FiCheck, FiInfo, FiX, FiAlertCircle } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const Toasts = () => {
    const { toasts, dismissToast } = useApp();

    useEffect(() => {
        const timers = toasts.map((toast) =>
            window.setTimeout(() => dismissToast(toast.id), 4800),
        );
        return () => timers.forEach(window.clearTimeout);
    }, [toasts, dismissToast]);

    return (
        <div aria-label="Notifications" className={styles.toasts}>
            {toasts.map((toast) => {
                const Icon = toast.type === "error" ? FiAlertCircle : toast.type === "info" ? FiInfo : FiCheck;
                return (
                    <div className={styles.toast} data-type={toast.type} key={toast.id} role="status">
                        <span className={styles.icon}><Icon aria-hidden="true" /></span>
                        <p>{toast.message}</p>
                        <button aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)} type="button"><FiX aria-hidden="true" /></button>
                    </div>
                );
            })}
        </div>
    );
};

export default Toasts;
