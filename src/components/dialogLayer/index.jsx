import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import ConfirmDialog from "../confirmDialog";
import CustomerForm from "../customerForm";
import ProfileDialog from "../profileDialog";
import TicketForm from "../ticketForm";
import styles from "./styles.module.css";

const DialogLayer = () => {
    const { dialog, closeDialog, customers, tickets, addCustomer, updateCustomer, deleteCustomer, deleteTicket } = useApp();
    const navigate = useNavigate();
    if (!dialog) return null;

    const { type, data } = dialog;
    let content = null;

    if (type === "ticketForm") {
        content = <TicketForm defaultCustomerId={data.customerId || ""} onClose={closeDialog} onCreated={(ticket) => { closeDialog(); navigate(`/inbox?ticket=${encodeURIComponent(ticket.id)}`); }} />;
    } else if (type === "customerForm") {
        const customer = customers.find((item) => item.id === data.customerId);
        content = <CustomerForm customer={customer} onClose={closeDialog} onSave={(values) => { if (customer) updateCustomer(customer.id, values); else addCustomer(values); closeDialog(); }} />;
    } else if (type === "confirmDelete") {
        const record = data.entity === "ticket" ? tickets.find((ticket) => ticket.id === data.id) : customers.find((customer) => customer.id === data.id);
        const remove = () => {
            if (data.entity === "ticket") deleteTicket(data.id);
            else deleteCustomer(data.id);
            closeDialog();
        };
        content = <ConfirmDialog confirmLabel={data.entity === "ticket" ? "Remove ticket" : "Remove customer"} description={data.entity === "ticket" ? `Remove ${record?.id || "this ticket"}: ${record?.subject || data.name}? Its conversation will be removed from this demo inbox.` : `Remove ${record?.name || data.name} and all of their linked tickets from this demo workspace?`} onCancel={closeDialog} onConfirm={remove} title={data.entity === "ticket" ? "Remove this ticket?" : "Remove this customer?"} />;
    } else if (type === "profile") {
        content = <ProfileDialog onClose={closeDialog} />;
    }

    return <div className={styles.layer}>{content}</div>;
};

export default DialogLayer;
