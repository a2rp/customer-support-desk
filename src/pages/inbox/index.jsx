import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiClock, FiCornerDownLeft, FiFlag, FiInbox, FiMail, FiMessageCircle, FiPlus, FiSearch, FiSend, FiShield, FiTag, FiTrash2, FiUser, FiUsers, FiZap } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import CustomerAvatar from "../../components/customerAvatar";
import styles from "./styles.module.css";
import { formatRelativeTime, getCustomer } from "../../utils.js";

const InboxPage = () => {
    const { tickets, customers, agent, agents, teamSettings, updateTicket, markTicketRead, addMessage, openDialog } = useApp();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTicket = searchParams.get("ticket");
    const globalSearch = searchParams.get("search");
    const [localSelectedId, setLocalSelectedId] = useState("");
    const [queue, setQueue] = useState("all");
    const [statusFilter, setStatusFilter] = useState("Open");
    const [localQuery, setLocalQuery] = useState("");
    const [draft, setDraft] = useState("");
    const [replyType, setReplyType] = useState("reply");
    const [mobileView, setMobileView] = useState(false);
    const [savedRepliesOpen, setSavedRepliesOpen] = useState(false);
    const selectedId = requestedTicket || localSelectedId;
    const mobileConversation = Boolean(requestedTicket) || mobileView;
    const query = globalSearch ?? localQuery;
    const setQuery = (value) => {
        setLocalQuery(value);
        if (searchParams.has("search")) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("search");
            setSearchParams(nextParams, { replace: true });
        }
    };

    const queueItems = [
        { id: "all", label: "All tickets", icon: FiInbox, count: tickets.filter((ticket) => ticket.status !== "Closed").length },
        { id: "mine", label: "Assigned to me", icon: FiUsers, count: tickets.filter((ticket) => ticket.assignedTo === agent && ticket.status !== "Closed").length },
        { id: "unassigned", label: "Unassigned", icon: FiUser, count: tickets.filter((ticket) => !ticket.assignedTo && ticket.status !== "Closed").length },
        { id: "urgent", label: "Urgent", icon: FiFlag, count: tickets.filter((ticket) => ticket.priority === "Urgent" && ticket.status !== "Closed").length },
    ];
    const baseTickets = useMemo(() => tickets.filter((ticket) => {
        if (queue === "mine" && ticket.assignedTo !== agent) return false;
        if (queue === "unassigned" && ticket.assignedTo) return false;
        if (queue === "urgent" && ticket.priority !== "Urgent") return false;
        if (queue === "pending" && ticket.status !== "Pending") return false;
        if (queue === "closed" && ticket.status !== "Closed") return false;
        return true;
    }), [agent, queue, tickets]);
    const statusCounts = useMemo(() => ({
        All: baseTickets.length,
        Open: baseTickets.filter((ticket) => ticket.status === "Open").length,
        Pending: baseTickets.filter((ticket) => ticket.status === "Pending").length,
        Closed: baseTickets.filter((ticket) => ticket.status === "Closed").length,
    }), [baseTickets]);
    const visibleTickets = useMemo(() => baseTickets.filter((ticket) => {
        if (statusFilter !== "All" && ticket.status !== statusFilter) return false;
        const customer = getCustomer(customers, ticket.customerId);
        return [ticket.id, ticket.subject, customer?.name, customer?.company, ...ticket.tags, ...ticket.messages.map((message) => message.text)].join(" ").toLowerCase().includes(query.trim().toLowerCase());
    }).sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt)), [baseTickets, customers, query, statusFilter]);
    const selected = tickets.find((ticket) => ticket.id === selectedId) || visibleTickets[0] || null;
    const customer = selected ? getCustomer(customers, selected.customerId) : null;
    const relatedTickets = customer ? tickets.filter((ticket) => ticket.customerId === customer.id && ticket.id !== selected?.id).slice(0, 4) : [];

    useEffect(() => {
        if (selected?.unread) markTicketRead(selected.id);
    }, [markTicketRead, selected]);

    const selectTicket = (ticket) => {
        setLocalSelectedId(ticket.id);
        markTicketRead(ticket.id);
        setSearchParams({ ticket: ticket.id }, { replace: true });
        setMobileView(true);
        setDraft("");
    };
    const selectQueue = (id) => {
        setQueue(id);
        setStatusFilter("All");
    };
    const sendMessage = (event) => {
        event.preventDefault();
        if (!selected || !draft.trim()) return;
        addMessage(selected.id, draft, replyType);
        setDraft("");
        setSavedRepliesOpen(false);
    };
    const handleComposerKey = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") sendMessage(event);
    };
    const appendSavedReply = (text) => {
        setDraft((current) => current ? `${current}\n\n${text}` : text);
        setSavedRepliesOpen(false);
        setReplyType("reply");
    };
    const changeStatus = (event) => updateTicket(selected.id, { status: event.target.value });
    const changePriority = (event) => updateTicket(selected.id, { priority: event.target.value });
    const changeAssignee = (event) => updateTicket(selected.id, { assignedTo: event.target.value || null });

    return (
        <div className={styles.inbox} data-mobile-conversation={mobileConversation}>
            <header className={styles.pageHeading}>
                <div><p>SUPPORT WORKSPACE <FiArrowUpRight aria-hidden="true" /></p><h1>Inbox</h1><span>Make every customer conversation feel taken care of.</span></div>
                <div className={styles.headingStats}><span><strong>{tickets.filter((ticket) => ticket.status !== "Closed").length}</strong> open conversations</span><span><i /> {tickets.filter((ticket) => !ticket.assignedTo && ticket.status !== "Closed").length} need an owner</span></div>
            </header>
            <div className={styles.inboxGrid} data-mobile-conversation={mobileConversation}>
                <aside aria-label="Ticket queues" className={styles.queuePanel}>
                    <div className={styles.queueHeading}><strong>Queues</strong><button aria-label="Create a ticket" onClick={() => openDialog("ticketForm")} type="button"><FiPlus aria-hidden="true" /></button></div>
                    <div className={styles.queueList}>
                        {queueItems.map((item) => {
                            const Icon = item.icon;
                            return <button aria-pressed={queue === item.id} className={queue === item.id ? styles.queueActive : styles.queueButton} key={item.id} onClick={() => selectQueue(item.id)} type="button"><Icon aria-hidden="true" /><span>{item.label}</span><small>{item.count}</small></button>;
                        })}
                    </div>
                    <div className={styles.queueDivider} />
                    <div className={styles.queueGroupLabel}>WORKFLOW</div>
                    <button aria-pressed={queue === "pending"} className={queue === "pending" ? styles.queueActive : styles.queueButton} onClick={() => selectQueue("pending")} type="button"><FiClock aria-hidden="true" /><span>Waiting on customer</span><small>{tickets.filter((ticket) => ticket.status === "Pending").length}</small></button>
                    <button aria-pressed={queue === "closed"} className={queue === "closed" ? styles.queueActive : styles.queueButton} onClick={() => selectQueue("closed")} type="button"><FiCheck aria-hidden="true" /><span>Resolved</span><small>{tickets.filter((ticket) => ticket.status === "Closed").length}</small></button>
                    <div className={styles.queueHint}><span><FiZap aria-hidden="true" /></span><strong>Keep it moving</strong><p>Quick, thoughtful replies help customers get back to work.</p></div>
                </aside>

                <section aria-label="Ticket list" className={styles.ticketList}>
                    <div className={styles.listHeading}><div><h2>Conversations</h2><small>{visibleTickets.length} {visibleTickets.length === 1 ? "ticket" : "tickets"}</small></div><span className={styles.listMenu}><FiPlus aria-hidden="true" /></span></div>
                    <label className={styles.ticketSearch}><FiSearch aria-hidden="true" /><input aria-label="Filter conversations" onChange={(event) => setQuery(event.target.value)} placeholder="Filter conversations" value={query} /></label>
                    <div aria-label="Filter by ticket status" className={styles.statusTabs}>
                        {["All", "Open", "Pending", "Closed"].map((status) => <button aria-pressed={statusFilter === status} className={statusFilter === status ? styles.statusActive : styles.statusTab} key={status} onClick={() => setStatusFilter(status)} type="button">{status}<small>{statusCounts[status]}</small></button>)}
                    </div>
                    <div className={styles.mobileQueue}><label>Queue<select onChange={(event) => selectQueue(event.target.value)} value={queue}><option value="all">All tickets</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option><option value="urgent">Urgent</option><option value="pending">Waiting on customer</option><option value="closed">Resolved</option></select></label></div>
                    <div className={styles.ticketItems}>
                        {visibleTickets.length ? visibleTickets.map((ticket) => {
                            const person = getCustomer(customers, ticket.customerId);
                            const lastMessage = ticket.messages.at(-1);
                            return <button aria-current={selected?.id === ticket.id ? "true" : undefined} className={selected?.id === ticket.id ? styles.ticketActive : styles.ticketButton} key={ticket.id} onClick={() => selectTicket(ticket)} type="button">
                                <span className={styles.ticketTop}><span className={styles.ticketId}>#{ticket.id.slice(-4)}</span><span className={styles.ticketTime}>{formatRelativeTime(ticket.updatedAt)}</span></span>
                                <strong className={styles.ticketSubject}>{ticket.subject}</strong>
                                <span className={styles.ticketPreview}>{lastMessage?.text || "No message yet"}</span>
                                <span className={styles.ticketBottom}><span className={styles.ticketPerson}>{person && <CustomerAvatar className={styles.miniAvatar} customer={person} />}<span>{person?.name || "Former customer"}</span></span><span className={styles.ticketBadges}>{ticket.priority === "Urgent" && <i aria-label="Urgent priority" className={styles.urgentDot} />}{ticket.unread && <i aria-label="Unread" className={styles.unreadDot} />}</span></span>
                            </button>;
                        }) : <div className={styles.listEmpty}><FiInbox aria-hidden="true" /><strong>No conversations here</strong><p>Try another queue or start a new ticket.</p><button onClick={() => openDialog("ticketForm")} type="button"><FiPlus aria-hidden="true" /> New ticket</button></div>}
                    </div>
                    <div className={styles.listFooter}><span><i /> Inbox is up to date</span><span>Just now</span></div>
                </section>

                <section aria-label={selected ? `Conversation ${selected.id}` : "Conversation"} className={styles.conversation}>
                    {selected ? <>
                        <div className={styles.conversationHeader}>
                            <button aria-label="Back to conversations" className={styles.mobileBack} onClick={() => { setMobileView(false); const nextParams = new URLSearchParams(searchParams); nextParams.delete("ticket"); setSearchParams(nextParams, { replace: true }); }} type="button"><FiArrowLeft aria-hidden="true" /></button>
                            <div className={styles.conversationTitle}><span className={styles.conversationId}>#{selected.id}</span><h2>{selected.subject}</h2><div className={styles.conversationMeta}><span><FiMail aria-hidden="true" /> {selected.channel}</span><span>Opened {formatRelativeTime(selected.createdAt)}</span></div></div>
                            <div className={styles.conversationActions}><button aria-label="Remove ticket" className={styles.removeTicket} onClick={() => openDialog("confirmDelete", { entity: "ticket", id: selected.id, name: selected.subject })} type="button"><FiTrash2 aria-hidden="true" /></button><select aria-label="Ticket status" className={styles.statusSelect} onChange={changeStatus} value={selected.status}><option>Open</option><option>Pending</option><option>Closed</option></select></div>
                        </div>
                        <div className={styles.ticketProperties}>
                            <label><FiFlag aria-hidden="true" /><span>Priority</span><select aria-label="Priority" className={styles.prioritySelect} data-priority={selected.priority} onChange={changePriority} value={selected.priority}><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></label>
                            <label><FiUsers aria-hidden="true" /><span>Assignee</span><select aria-label="Assignee" onChange={changeAssignee} value={selected.assignedTo || ""}><option value="">Unassigned</option>{agents.map((person) => <option key={person}>{person}</option>)}</select></label>
                            {teamSettings.showSla && selected.status !== "Closed" && <span className={styles.sla}><FiClock aria-hidden="true" /> Reply due in {selected.priority === "Urgent" ? "18 min" : selected.priority === "High" ? "1 hour" : "3 hours"}</span>}
                        </div>
                        <div aria-label="Conversation messages" className={styles.messages}>
                            <div className={styles.dayDivider}><span>{new Date(selected.createdAt).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</span></div>
                            {selected.messages.map((message) => <article className={styles.message} data-role={message.role} key={message.id}>
                                {message.role === "note" ? <div className={styles.noteMessage}><span className={styles.noteIcon}><FiShield aria-hidden="true" /></span><div><header><strong>Private note · {message.author}</strong><time>{message.time}</time></header><p>{message.text}</p></div></div> : <>
                                    <CustomerAvatar className={styles.messageAvatar} customer={message.role === "customer" ? customer : { avatar: "MC", color: "sand" }} />
                                    <div className={styles.messageBody}><header><strong>{message.author}</strong><span>{message.role === "customer" ? "Customer" : "You"}</span><time>{message.time}</time></header><p>{message.text}</p></div>
                                </>}
                            </article>)}
                        </div>
                        <form className={styles.composer} onSubmit={sendMessage}>
                            <div className={styles.composerTabs}><button aria-pressed={replyType === "reply"} className={replyType === "reply" ? styles.composerActive : styles.composerTab} onClick={() => setReplyType("reply")} type="button"><FiMessageCircle aria-hidden="true" /> Reply</button><button aria-pressed={replyType === "note"} className={replyType === "note" ? styles.noteActive : styles.composerTab} onClick={() => setReplyType("note")} type="button"><FiShield aria-hidden="true" /> Internal note</button><div className={styles.savedReplies}><button aria-expanded={savedRepliesOpen} className={styles.savedReplyButton} onClick={() => setSavedRepliesOpen(!savedRepliesOpen)} type="button"><FiZap aria-hidden="true" /> Saved reply</button>{savedRepliesOpen && <div className={styles.savedReplyMenu}><button onClick={() => appendSavedReply("Thanks for reaching out. I am looking into this and will follow up shortly.")} type="button">I am looking into this</button><button onClick={() => appendSavedReply("Could you share a screenshot and the steps you took before this happened? That will help us investigate.")} type="button">Ask for more details</button><button onClick={() => appendSavedReply("I have shared this with our technical team. I will update you as soon as I have more information.")} type="button">Escalated to the team</button></div>}</div></div>
                            {replyType === "note" && <p className={styles.noteHint}><FiShield aria-hidden="true" /> Only teammates can see this note.</p>}
                            <textarea aria-label={replyType === "note" ? "Write an internal note" : "Write a reply"} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKey} placeholder={replyType === "note" ? "Add context for your team..." : "Write a thoughtful reply..."} rows={3} value={draft} />
                            <div className={styles.composerFooter}><span><FiCornerDownLeft aria-hidden="true" /> Ctrl + Enter to {replyType === "note" ? "add note" : "reply"}</span><button className={replyType === "note" ? styles.noteSubmit : styles.sendButton} disabled={!draft.trim()} type="submit">{replyType === "note" ? <FiCheck aria-hidden="true" /> : <FiSend aria-hidden="true" />}{replyType === "note" ? " Add note" : " Add reply"}</button></div>
                        </form>
                    </> : <div className={styles.conversationEmpty}><span><FiMessageCircle aria-hidden="true" /></span><h2>Choose a conversation</h2><p>Select a ticket from the list to read the thread and reply.</p></div>}
                </section>

                <aside aria-label="Customer profile" className={styles.customerPanel}>
                    {selected && customer ? <>
                        <div className={styles.profileTop}><span>ABOUT CUSTOMER</span><button aria-label="Edit customer" onClick={() => openDialog("customerForm", { customerId: customer.id })} type="button">Edit</button></div>
                        <div className={styles.customerIdentity}><CustomerAvatar className={styles.largeAvatar} customer={customer} /><h3>{customer.name}</h3><p>{customer.company}</p><span className={styles.planBadge}>{customer.plan} plan</span></div>
                        <div className={styles.customerFacts}><div><span>Email</span><a href={`mailto:${customer.email}`}>{customer.email}</a></div><div><span>Location</span><strong>{customer.location || "Not added"}</strong></div><div><span>Customer since</span><strong>{new Date(customer.joined + "T00:00:00").toLocaleDateString("en", { month: "short", year: "numeric" })}</strong></div></div>
                        {customer.notes && <div className={styles.customerNote}><span><FiTag aria-hidden="true" /> SUPPORT NOTES</span><p>{customer.notes}</p></div>}
                        <div className={styles.relatedHeading}><strong>Recent conversations</strong><small>{relatedTickets.length}</small></div>
                        {relatedTickets.length ? <div className={styles.relatedTickets}>{relatedTickets.map((ticket) => <button key={ticket.id} onClick={() => selectTicket(ticket)} type="button"><span>#{ticket.id.slice(-4)} · {ticket.status}</span><strong>{ticket.subject}</strong></button>)}</div> : <p className={styles.noRelated}>No other conversations yet.</p>}
                        <button className={styles.profileLink} onClick={() => navigate(`/customers?customer=${encodeURIComponent(customer.id)}`)} type="button">View customer profile <FiArrowUpRight aria-hidden="true" /></button>
                    </> : <div className={styles.profilePlaceholder}><FiUsers aria-hidden="true" /><p>Customer details appear here.</p></div>}
                </aside>
            </div>
        </div>
    );
};

export default InboxPage;
