import { useState } from "react";
import { AppContext } from "./context.js";

const currentAgent = "Maya Chen";

const initialCustomers = [
    { id: "cus-1", name: "Avery Morgan", email: "avery@juniperandco.com", company: "Juniper & Co.", plan: "Growth", location: "Portland, OR", joined: "2025-02-18", avatar: "AM", color: "lilac", notes: "Prefers email updates and usually replies in the morning." },
    { id: "cus-2", name: "Theo Bennett", email: "theo@northline.io", company: "Northline", plan: "Scale", location: "Brooklyn, NY", joined: "2024-10-04", avatar: "TB", color: "blue", notes: "Primary admin. Their launch review is scheduled for next month." },
    { id: "cus-3", name: "Priya Desai", email: "priya@fieldnotes.com", company: "Fieldnotes Studio", plan: "Growth", location: "Austin, TX", joined: "2025-05-21", avatar: "PD", color: "peach", notes: "Product designer and account champion." },
    { id: "cus-4", name: "Noah Williams", email: "noah@meridianhealth.org", company: "Meridian Health", plan: "Enterprise", location: "Chicago, IL", joined: "2024-06-11", avatar: "NW", color: "mint", notes: "Route billing requests to their finance lead, Elise." },
    { id: "cus-5", name: "Lina Park", email: "lina@kindredmarket.com", company: "Kindred Market", plan: "Starter", location: "Denver, CO", joined: "2025-08-09", avatar: "LP", color: "rose", notes: "New customer. Onboarding questions are common this week." },
    { id: "cus-6", name: "Marcus Reed", email: "marcus@atlasworks.co", company: "Atlas Works", plan: "Scale", location: "Seattle, WA", joined: "2024-11-27", avatar: "MR", color: "sand", notes: "Has requested a security review packet before." },
    { id: "cus-7", name: "Sofia Alvarez", email: "sofia@brightpath.org", company: "Brightpath", plan: "Growth", location: "Miami, FL", joined: "2025-03-02", avatar: "SA", color: "blue", notes: "Prefers concise answers with links to help articles." },
];

const initialTickets = [
    { id: "RL-4821", customerId: "cus-1", subject: "Import stopped halfway through", status: "Open", priority: "Urgent", channel: "Email", assignedTo: currentAgent, unread: true, createdAt: "2026-10-10T09:42:00", updatedAt: "2026-10-10T10:16:00", tags: ["data import", "blocked"], messages: [{ id: "m-4821-1", author: "Avery Morgan", role: "customer", time: "9:42 AM", text: "Hi, I started importing our contacts this morning. The progress bar reached about 60% and then stopped. I have a team onboarding at noon, so I am hoping we can get this moving before then." }, { id: "m-4821-2", author: currentAgent, role: "agent", time: "9:51 AM", text: "Thanks for flagging this, Avery. I am checking the import log now. Could you share the file name and roughly how many rows it contains?" }, { id: "m-4821-3", author: "Avery Morgan", role: "customer", time: "10:16 AM", text: "It is contacts-october.csv, just under 4,000 rows. I have not changed the file since exporting it." }] },
    { id: "RL-4819", customerId: "cus-2", subject: "Can we add a second workspace?", status: "Pending", priority: "Normal", channel: "Chat", assignedTo: "Jordan Lee", unread: false, createdAt: "2026-10-10T09:18:00", updatedAt: "2026-10-10T10:04:00", tags: ["workspace"], messages: [{ id: "m-4819-1", author: "Theo Bennett", role: "customer", time: "9:18 AM", text: "Our product group is splitting into two teams. Is it possible to keep a separate workspace for each team under one account?" }, { id: "m-4819-2", author: "Jordan Lee", role: "agent", time: "9:34 AM", text: "Yes, your Scale plan supports multiple workspaces. I have shared the setup guide and can help move the new team over." }, { id: "m-4819-3", author: "Theo Bennett", role: "customer", time: "10:04 AM", text: "Perfect, thanks. I will check with the team and come back with a date." }] },
    { id: "RL-4817", customerId: "cus-3", subject: "Invoice needs the updated tax ID", status: "Open", priority: "High", channel: "Email", assignedTo: null, unread: true, createdAt: "2026-10-10T08:51:00", updatedAt: "2026-10-10T09:02:00", tags: ["billing"], messages: [{ id: "m-4817-1", author: "Priya Desai", role: "customer", time: "8:51 AM", text: "Could you update the tax ID on our October invoice? Our finance team needs the corrected copy before they close this afternoon." }] },
    { id: "RL-4814", customerId: "cus-4", subject: "Where can I find the audit log?", status: "Open", priority: "Normal", channel: "Web", assignedTo: "Maya Chen", unread: false, createdAt: "2026-10-10T08:26:00", updatedAt: "2026-10-10T08:47:00", tags: ["how-to", "security"], messages: [{ id: "m-4814-1", author: "Noah Williams", role: "customer", time: "8:26 AM", text: "We are preparing for an internal review. Where can I download the workspace audit log?" }, { id: "m-4814-2", author: currentAgent, role: "agent", time: "8:47 AM", text: "You can find it in Settings under Security and activity. I have included a short guide in the links panel." }] },
    { id: "RL-4812", customerId: "cus-5", subject: "Getting started with team invites", status: "Open", priority: "Low", channel: "Chat", assignedTo: "Riley Brooks", unread: false, createdAt: "2026-10-10T07:48:00", updatedAt: "2026-10-10T08:05:00", tags: ["onboarding"], messages: [{ id: "m-4812-1", author: "Lina Park", role: "customer", time: "7:48 AM", text: "I invited two teammates but they have not received their welcome emails yet. Is there anything I should check?" }, { id: "m-4812-2", author: "Riley Brooks", role: "agent", time: "8:05 AM", text: "Please ask them to check spam first. You can also resend each invite from Settings, then Team. I have added the steps here." }] },
    { id: "RL-4808", customerId: "cus-6", subject: "Webhook deliveries are delayed", status: "Open", priority: "Urgent", channel: "Email", assignedTo: "Jordan Lee", unread: false, createdAt: "2026-10-10T07:02:00", updatedAt: "2026-10-10T07:38:00", tags: ["webhooks", "engineering"], messages: [{ id: "m-4808-1", author: "Marcus Reed", role: "customer", time: "7:02 AM", text: "We are seeing webhook events arrive several minutes late. This is affecting our fulfillment sync. Can you check whether there is an incident?" }, { id: "m-4808-2", author: "Jordan Lee", role: "agent", time: "7:38 AM", text: "I have escalated this to our technical team and will share an update as soon as I hear back." }] },
    { id: "RL-4804", customerId: "cus-7", subject: "Update the billing contact", status: "Closed", priority: "Normal", channel: "Email", assignedTo: currentAgent, unread: false, createdAt: "2026-10-09T15:10:00", updatedAt: "2026-10-09T16:21:00", tags: ["billing"], messages: [{ id: "m-4804-1", author: "Sofia Alvarez", role: "customer", time: "Yesterday, 3:10 PM", text: "Please change our billing contact to finance@brightpath.org." }, { id: "m-4804-2", author: currentAgent, role: "agent", time: "Yesterday, 4:21 PM", text: "Done. The billing contact has been updated for your next invoice." }] },
    { id: "RL-4798", customerId: "cus-1", subject: "How do I export a team report?", status: "Closed", priority: "Low", channel: "Web", assignedTo: "Riley Brooks", unread: false, createdAt: "2026-10-09T11:05:00", updatedAt: "2026-10-09T11:44:00", tags: ["reporting"], messages: [{ id: "m-4798-1", author: "Avery Morgan", role: "customer", time: "Yesterday, 11:05 AM", text: "I need to share a weekly activity report with my manager. Can I export it as a spreadsheet?" }, { id: "m-4798-2", author: "Riley Brooks", role: "agent", time: "Yesterday, 11:44 AM", text: "Open Reports, choose a date range, then use Export CSV. It includes the current filters." }] },
];

const initialAgents = [currentAgent, "Jordan Lee", "Riley Brooks", "Casey Adams"];

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const AppProvider = ({ children }) => {
    const [customers, setCustomers] = useState(initialCustomers);
    const [tickets, setTickets] = useState(initialTickets);
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null);
    const [activity, setActivity] = useState([]);
    const [agent, setAgent] = useState(currentAgent);
    const [teamSettings, setTeamSettings] = useState({ showSla: true, autoAssign: false });
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const addToast = (message, type = "success") => {
        const id = makeId("toast");
        setToasts((current) => [...current, { id, message, type }]);
        return id;
    };
    const dismissToast = (id) => setToasts((current) => current.filter((toast) => toast.id !== id));
    const openDialog = (type, data = {}) => setDialog({ type, data });
    const closeDialog = () => setDialog(null);
    const logActivity = (message) => setActivity((current) => [{ id: makeId("activity"), message, time: new Date().toISOString() }, ...current].slice(0, 20));

    const addCustomer = (values) => {
        const customer = { ...values, id: makeId("cus"), avatar: values.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), color: "blue", joined: new Date().toISOString().slice(0, 10) };
        setCustomers((current) => [customer, ...current]);
        logActivity(`Added customer ${customer.name}`);
        addToast(`${customer.name} added`);
        return customer;
    };
    const updateCustomer = (id, values) => {
        setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, ...values, avatar: values.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() } : customer));
        logActivity(`Updated customer ${values.name}`);
        addToast(`${values.name} updated`);
    };
    const deleteCustomer = (id) => {
        const customer = customers.find((item) => item.id === id);
        if (!customer) return;
        const linkedIds = new Set(tickets.filter((ticket) => ticket.customerId === id).map((ticket) => ticket.id));
        setCustomers((current) => current.filter((item) => item.id !== id));
        setTickets((current) => current.filter((ticket) => !linkedIds.has(ticket.id)));
        logActivity(`Removed customer ${customer.name}`);
        addToast(`${customer.name} and ${linkedIds.size} linked tickets removed`, "info");
    };
    const addTicket = (values) => {
        const id = `RL-${Math.floor(4900 + Math.random() * 99)}`;
        const now = new Date().toISOString();
        const ticket = { ...values, id, status: "Open", assignedTo: values.assignedTo || null, unread: false, channel: values.channel || "Email", tags: values.tags || [], createdAt: now, updatedAt: now, messages: [{ id: makeId("message"), author: values.customerName, role: "customer", time: "Just now", text: values.initialMessage }] };
        setTickets((current) => [ticket, ...current]);
        logActivity(`Created ticket ${id}`);
        addToast(`Ticket ${id} created`);
        return ticket;
    };
    const addMessage = (ticketId, text, type = "reply") => {
        const ticket = tickets.find((item) => item.id === ticketId);
        if (!ticket || !text.trim()) return;
        const now = new Date().toISOString();
        const message = { id: makeId("message"), author: agent, role: type === "note" ? "note" : "agent", time: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()), text: text.trim() };
        setTickets((current) => current.map((item) => item.id === ticketId ? { ...item, messages: [...item.messages, message], status: type === "note" ? item.status : "Pending", updatedAt: now, unread: false } : item));
        logActivity(`${type === "note" ? "Added a note to" : "Replied to"} ${ticketId}`);
        addToast(type === "note" ? "Internal note added" : "Reply added to the demo conversation", "info");
    };
    const updateTicket = (id, values) => {
        setTickets((current) => current.map((ticket) => ticket.id === id ? { ...ticket, ...values, updatedAt: new Date().toISOString() } : ticket));
        const detail = values.status ? `moved to ${values.status.toLowerCase()}` : values.priority ? `set to ${values.priority.toLowerCase()} priority` : values.assignedTo === null ? "unassigned" : `assigned to ${values.assignedTo}`;
        logActivity(`Ticket ${id} ${detail}`);
        addToast(`Ticket ${id} ${detail}`, "info");
    };
    const markTicketRead = (id) => setTickets((current) => current.map((ticket) => ticket.id === id ? { ...ticket, unread: false } : ticket));
    const deleteTicket = (id) => {
        const ticket = tickets.find((item) => item.id === id);
        if (!ticket) return;
        setTickets((current) => current.filter((item) => item.id !== id));
        logActivity(`Removed ticket ${id}`);
        addToast(`Ticket ${id} removed`, "info");
    };

    const value = { customers, tickets, toasts, dialog, activity, agent, agents: initialAgents, teamSettings, setTeamSettings, setAgent, mobileNavOpen, setMobileNavOpen, addToast, dismissToast, openDialog, closeDialog, addCustomer, updateCustomer, deleteCustomer, addTicket, addMessage, updateTicket, markTicketRead, deleteTicket };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider };
