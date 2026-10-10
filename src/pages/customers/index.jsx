import { useMemo, useState } from "react";
import { FiActivity, FiArrowUpRight, FiDownload, FiEdit3, FiMail, FiMessageCircle, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerAvatar from "../../components/customerAvatar";
import { useApp } from "../../context/useApp.js";
import { downloadCsv, formatRelativeTime } from "../../utils.js";
import styles from "./styles.module.css";

const CustomersPage = () => {
    const { customers, tickets, openDialog, addToast } = useApp();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("customer");
    const [query, setQuery] = useState("");
    const [plan, setPlan] = useState("All plans");
    const [activity, setActivity] = useState("All customers");
    const [sort, setSort] = useState("Recently active");

    const visibleCustomers = useMemo(() => customers.filter((customer) => {
        const term = query.trim().toLowerCase();
        const openTickets = tickets.filter((ticket) => ticket.customerId === customer.id && ticket.status !== "Closed").length;
        return (!term || [customer.name, customer.email, customer.company, customer.location].join(" ").toLowerCase().includes(term))
            && (plan === "All plans" || customer.plan === plan)
            && (activity === "All customers" || (activity === "Has open tickets" ? openTickets > 0 : openTickets === 0));
    }).sort((first, second) => {
        if (sort === "Name A-Z") return first.name.localeCompare(second.name);
        if (sort === "Most open tickets") return tickets.filter((ticket) => ticket.customerId === second.id && ticket.status !== "Closed").length - tickets.filter((ticket) => ticket.customerId === first.id && ticket.status !== "Closed").length;
        const firstActivity = Math.max(0, ...tickets.filter((ticket) => ticket.customerId === first.id).map((ticket) => new Date(ticket.updatedAt).getTime()));
        const secondActivity = Math.max(0, ...tickets.filter((ticket) => ticket.customerId === second.id).map((ticket) => new Date(ticket.updatedAt).getTime()));
        return secondActivity - firstActivity;
    }), [activity, customers, plan, query, sort, tickets]);
    const selected = customers.find((customer) => customer.id === selectedId) || visibleCustomers[0] || null;
    const selectedTickets = selected ? tickets.filter((ticket) => ticket.customerId === selected.id).sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt)) : [];
    const openTicketCount = tickets.filter((ticket) => ticket.status !== "Closed").length;
    const activeCustomers = new Set(tickets.filter((ticket) => ticket.status !== "Closed").map((ticket) => ticket.customerId)).size;

    const chooseCustomer = (id) => setSearchParams({ customer: id }, { replace: true });
    const exportCustomers = () => {
        const rows = visibleCustomers.map((customer) => ({
            name: customer.name,
            company: customer.company,
            email: customer.email,
            plan: customer.plan,
            location: customer.location,
            openTickets: tickets.filter((ticket) => ticket.customerId === customer.id && ticket.status !== "Closed").length,
            notes: customer.notes,
        }));
        if (downloadCsv(rows, "relay-customers.csv")) addToast(`${rows.length} customer records exported`, "info");
        else addToast("There are no customer records to export", "info");
    };
    const startTicket = () => openDialog("ticketForm", { customerId: selected?.id });

    return (
        <div className={styles.customersPage}>
            <header className={styles.heading}>
                <div><p>CUSTOMER DIRECTORY <FiArrowUpRight aria-hidden="true" /></p><h1>Customers</h1><span>Every conversation starts with a person.</span></div>
                <button className={styles.addButton} onClick={() => openDialog("customerForm")} type="button"><FiPlus aria-hidden="true" /> Add customer</button>
            </header>
            <section aria-label="Customer summary" className={styles.metrics}>
                <article><span className={styles.metricIcon}><FiUsers aria-hidden="true" /></span><div><small>Customers</small><strong>{customers.length}</strong></div><span className={styles.metricNote}>In your directory</span></article>
                <article><span className={styles.metricIcon} data-tone="teal"><FiActivity aria-hidden="true" /></span><div><small>With open tickets</small><strong>{activeCustomers}</strong></div><span className={styles.metricNote}>{openTicketCount} active conversations</span></article>
                <article><span className={styles.metricIcon} data-tone="amber"><FiMessageCircle aria-hidden="true" /></span><div><small>Unassigned conversations</small><strong>{tickets.filter((ticket) => !ticket.assignedTo && ticket.status !== "Closed").length}</strong></div><span className={styles.metricNote}>Ready for an owner</span></article>
            </section>
            <section aria-label="Customer directory" className={styles.directory}>
                <div className={styles.toolbar}>
                    <label className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Search customers" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, or email" value={query} /></label>
                    <label className={styles.filter}>Plan<select onChange={(event) => setPlan(event.target.value)} value={plan}><option>All plans</option><option>Starter</option><option>Growth</option><option>Scale</option><option>Enterprise</option></select></label>
                    <label className={styles.filter}>Activity<select onChange={(event) => setActivity(event.target.value)} value={activity}><option>All customers</option><option>Has open tickets</option><option>No open tickets</option></select></label>
                    <label className={styles.sort}>Sort<select onChange={(event) => setSort(event.target.value)} value={sort}><option>Recently active</option><option>Name A-Z</option><option>Most open tickets</option></select></label>
                    <button aria-label="Export filtered customers as CSV" className={styles.exportButton} onClick={exportCustomers} type="button"><FiDownload aria-hidden="true" /><span>Export</span></button>
                </div>
                <div className={styles.directoryGrid}>
                    <div className={styles.tableWrap}>
                        {visibleCustomers.length ? <table>
                            <thead><tr><th scope="col">Customer</th><th scope="col">Plan</th><th scope="col">Open tickets</th><th scope="col">Last conversation</th><th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
                            <tbody>{visibleCustomers.map((customer) => {
                                const customerTickets = tickets.filter((ticket) => ticket.customerId === customer.id);
                                const activeCount = customerTickets.filter((ticket) => ticket.status !== "Closed").length;
                                const latest = customerTickets.sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))[0];
                                return <tr aria-selected={selected?.id === customer.id} className={selected?.id === customer.id ? styles.selectedRow : undefined} key={customer.id}>
                                    <td><button className={styles.customerCell} onClick={() => chooseCustomer(customer.id)} type="button"><CustomerAvatar customer={customer} /><span><strong>{customer.name}</strong><small>{customer.company}</small></span></button></td>
                                    <td><span className={styles.planBadge} data-plan={customer.plan}>{customer.plan}</span></td>
                                    <td><span className={activeCount ? styles.ticketCount : styles.zeroTickets}>{activeCount}</span></td>
                                    <td>{latest ? <span className={styles.lastSeen}>{formatRelativeTime(latest.updatedAt)}</span> : <span className={styles.lastSeen}>No tickets yet</span>}</td>
                                    <td><button aria-label={`Open ${customer.name} profile`} className={styles.openButton} onClick={() => chooseCustomer(customer.id)} type="button"><FiArrowUpRight aria-hidden="true" /></button></td>
                                </tr>;
                            })}</tbody>
                        </table> : <div className={styles.empty}><FiSearch aria-hidden="true" /><strong>No customers match</strong><p>Try another name, plan, or activity filter.</p><button onClick={() => { setQuery(""); setPlan("All plans"); setActivity("All customers"); }} type="button">Clear filters</button></div>}
                    </div>
                    <aside aria-label={selected ? `${selected.name} profile` : "Customer profile"} className={styles.profilePanel}>
                        {selected ? <>
                            <div className={styles.profileActions}><button aria-label={`Edit ${selected.name}`} onClick={() => openDialog("customerForm", { customerId: selected.id })} type="button"><FiEdit3 aria-hidden="true" /> Edit</button><button aria-label={`Remove ${selected.name}`} className={styles.deleteButton} onClick={() => openDialog("confirmDelete", { entity: "customer", id: selected.id, name: selected.name })} type="button"><FiTrash2 aria-hidden="true" /></button></div>
                            <div className={styles.profileIdentity}><CustomerAvatar className={styles.largeAvatar} customer={selected} /><h2>{selected.name}</h2><p>{selected.company}</p><span className={styles.planBadge} data-plan={selected.plan}>{selected.plan} plan</span></div>
                            <div className={styles.profileFacts}><div><span>Email</span><a href={`mailto:${selected.email}`}><FiMail aria-hidden="true" /> {selected.email}</a></div><div><span>Location</span><strong>{selected.location || "Not added"}</strong></div><div><span>Customer since</span><strong>{new Date(selected.joined + "T00:00:00").toLocaleDateString("en", { month: "long", year: "numeric" })}</strong></div></div>
                            {selected.notes && <div className={styles.notes}><span>SUPPORT NOTES</span><p>{selected.notes}</p></div>}
                            <div className={styles.historyHeading}><strong>Recent conversations</strong><small>{selectedTickets.length}</small></div>
                            {selectedTickets.length ? <div className={styles.history}>{selectedTickets.slice(0, 4).map((ticket) => <button key={ticket.id} onClick={() => navigate(`/inbox?ticket=${encodeURIComponent(ticket.id)}`)} type="button"><span>#{ticket.id.slice(-4)} · {ticket.status}</span><strong>{ticket.subject}</strong></button>)}</div> : <p className={styles.noHistory}>No conversations yet.</p>}
                            <button className={styles.createTicket} onClick={startTicket} type="button"><FiPlus aria-hidden="true" /> Create ticket for {selected.name.split(" ")[0]}</button>
                        </> : <div className={styles.noSelection}><FiUsers aria-hidden="true" /><strong>Select a customer</strong><p>Choose a customer to view their support history.</p></div>}
                    </aside>
                </div>
                <div className={styles.tableFooter}><span>Showing {visibleCustomers.length} of {customers.length} customers</span><span>Customer records update across the workspace.</span></div>
            </section>
        </div>
    );
};

export default CustomersPage;
