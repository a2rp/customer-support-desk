import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ title, description, onClose, children, size = "medium" }) => {
    const dialogRef = useRef(null);
    const titleId = "dialog-title-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    useEffect(() => {
        const previousFocus = document.activeElement;
        const firstControl = dialogRef.current?.querySelector("button, input, select, textarea, [tabindex='0']");
        firstControl?.focus();
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "Tab" && dialogRef.current) {
                const controls = [...dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex='0']")];
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            previousFocus?.focus?.();
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section aria-labelledby={titleId} aria-modal="true" className={styles.dialog} data-size={size} ref={dialogRef} role="dialog">
                <header className={styles.header}>
                    <div>
                        <h2 id={titleId}>{title}</h2>
                        {description && <p>{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
                </header>
                <div className={styles.content}>{children}</div>
            </section>
        </div>
    );
};

export default Modal;
