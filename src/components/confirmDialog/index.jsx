import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel = "Confirm", onConfirm, onCancel }) => (
    <Modal description={description} onClose={onCancel} size="small" title={title}>
        <div className={styles.confirm}>
            <span className={styles.warning}><FiAlertTriangle aria-hidden="true" /></span>
            <p>This change will take effect immediately in this demo workspace.</p>
            <div className={styles.actions}>
                <button className={styles.cancelButton} onClick={onCancel} type="button">Cancel</button>
                <button className={styles.deleteButton} onClick={onConfirm} type="button"><FiTrash2 aria-hidden="true" /> {confirmLabel}</button>
            </div>
        </div>
    </Modal>
);

export default ConfirmDialog;
