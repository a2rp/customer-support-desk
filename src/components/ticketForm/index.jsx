import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const TicketForm = ({ defaultCustomerId = "", onClose, onCreated }) => {
    const { customers, agents, addTicket } = useApp();
    const [values, setValues] = useState({ customerId: defaultCustomerId, subject: "", priority: "Normal", channel: "Email", assignedTo: "", tags: "", initialMessage: "" });
    const [error, setError] = useState("");
    const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const customer = customers.find((item) => item.id === values.customerId);
        if (!customer) return setError("Choose a customer for this conversation.");
        if (values.subject.trim().length < 4) return setError("Add a subject with at least 4 characters.");
        if (values.initialMessage.trim().length < 10) return setError("Add a little more detail to the first message.");
        const ticket = addTicket({ ...values, subject: values.subject.trim(), customerName: customer.name, initialMessage: values.initialMessage.trim(), assignedTo: values.assignedTo || null, tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
        onCreated(ticket);
    };

    return (
        <Modal description="Start a new customer conversation and add it to your inbox." onClose={onClose} size="large" title="Create a ticket">
            <form className={styles.form} onSubmit={submit}>
                <label>Customer <select onChange={setField("customerId")} value={values.customerId}><option value="">Choose a customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.company}</option>)}</select></label>
                <label className={styles.wide}>Subject <input autoComplete="off" maxLength={100} onChange={setField("subject")} placeholder="What does the customer need help with?" value={values.subject} /></label>
                <label>Priority <select onChange={setField("priority")} value={values.priority}><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></label>
                <label>Channel <select onChange={setField("channel")} value={values.channel}><option>Email</option><option>Chat</option><option>Web</option></select></label>
                <label>Assignee <select onChange={setField("assignedTo")} value={values.assignedTo}><option value="">Unassigned</option>{agents.map((person) => <option key={person}>{person}</option>)}</select></label>
                <label>Tags <input onChange={setField("tags")} placeholder="billing, onboarding" value={values.tags} /></label>
                <label className={styles.wide}>First message <textarea maxLength={1200} onChange={setField("initialMessage")} placeholder="Add the customer's message or a clear summary..." rows={5} value={values.initialMessage} /></label>
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.actions}><button className={styles.cancel} onClick={onClose} type="button">Cancel</button><button className={styles.submit} type="submit"><FiSend aria-hidden="true" /> Create ticket</button></div>
            </form>
        </Modal>
    );
};

export default TicketForm;
