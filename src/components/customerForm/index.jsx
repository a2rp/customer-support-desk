import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const emptyCustomer = { name: "", email: "", company: "", plan: "Growth", location: "", notes: "" };

const CustomerForm = ({ customer, onClose, onSave }) => {
    const [values, setValues] = useState(customer ? { ...customer } : emptyCustomer);
    const [error, setError] = useState("");
    const { addToast } = useApp();
    const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        if (values.name.trim().length < 2) return setError("Enter the customer's name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return setError("Enter a valid email address.");
        if (values.company.trim().length < 2) return setError("Enter a company name.");
        onSave({ ...values, name: values.name.trim(), email: values.email.trim(), company: values.company.trim(), location: values.location.trim(), notes: values.notes.trim() });
        addToast(customer ? "Customer details updated" : "Customer added to the desk");
    };

    return (
        <Modal description={customer ? "Keep this customer's contact details and support preferences current." : "Add a customer record to link conversations and support history."} onClose={onClose} title={customer ? "Edit customer" : "Add customer"}>
            <form className={styles.form} onSubmit={submit}>
                <label>Full name <input autoComplete="name" maxLength={80} onChange={setField("name")} placeholder="Jamie Rivera" value={values.name} /></label>
                <label>Email address <input autoComplete="email" maxLength={120} onChange={setField("email")} placeholder="jamie@company.com" type="email" value={values.email} /></label>
                <label>Company <input autoComplete="organization" maxLength={100} onChange={setField("company")} placeholder="Company name" value={values.company} /></label>
                <label>Plan <select onChange={setField("plan")} value={values.plan}><option>Starter</option><option>Growth</option><option>Scale</option><option>Enterprise</option></select></label>
                <label>Location <input autoComplete="address-level2" maxLength={80} onChange={setField("location")} placeholder="City, region" value={values.location} /></label>
                <label className={styles.wide}>Support notes <textarea maxLength={500} onChange={setField("notes")} placeholder="Useful preferences or account context" rows={3} value={values.notes} /></label>
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.actions}><button className={styles.cancel} onClick={onClose} type="button">Cancel</button><button className={styles.submit} type="submit"><FiUserPlus aria-hidden="true" /> {customer ? "Save customer" : "Add customer"}</button></div>
            </form>
        </Modal>
    );
};

export default CustomerForm;
