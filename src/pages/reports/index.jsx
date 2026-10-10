import { useMemo, useState } from "react";
import { FiActivity, FiArrowUpRight, FiBarChart2, FiCheckCircle, FiDownload, FiInbox, FiMail, FiMessageCircle, FiUsers, FiZap } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import { downloadCsv, getCustomer } from "../../utils.js";
import styles from "./styles.module.css";

const ReportsPage = () => {
    const { tickets, customers, agents, addToast } = useApp();
    const [range, setRange] = useState("7 days");
    const reportTickets = useMemo(() => {
        if (range === "All time") return tickets;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - (range === "7 days" ? 7 : 30));
        return tickets.filter((ticket) => new Date(ticket.createdAt) >= cutoff);
    }, [range, tickets]);
    const totals = {
        open: reportTickets.filter((ticket) => ticket.status === "Open").length,
        pending: reportTickets.filter((ticket) => ticket.status === "Pending").length,
        closed: reportTickets.filter((ticket) => ticket.status === "Closed").length,
        unassigned: reportTickets.filter((ticket) => !ticket.assignedTo && ticket.status !== "Closed").length,
        answered: reportTickets.filter((ticket) => ticket.messages.some((message) => message.role === "agent")).length,
    };
    const responseCoverage = reportTickets.length ? Math.round((totals.answered / reportTickets.length) * 100) : 0;
    const channelData = ["Email", "Chat", "Web"].map((channel) => ({ name: channel, count: reportTickets.filter((ticket) => ticket.channel === channel).length }));
    const channelMaximum = Math.max(1, ...channelData.map((item) => item.count));
    const agentData = [...agents, "Unassigned"].map((name) => ({ name, count: reportTickets.filter((ticket) => (ticket.assignedTo || "Unassigned") === name && ticket.status !== "Closed").length }));
    const agentMaximum = Math.max(1, ...agentData.map((item) => item.count));
    const statusData = [
        { name: "Open", count: totals.open, color: "#4267df" },
        { name: "Pending", count: totals.pending, color: "#e3a43c" },
        { name: "Resolved", count: totals.closed, color: "#26a283" },
    ];
    let statusStart = 0;
    const statusGradient = reportTickets.length
        ? `conic-gradient(${statusData.map((item) => {
            const statusEnd = statusStart + (item.count / reportTickets.length) * 100;
            const segment = `${item.color} ${statusStart}% ${statusEnd}%`;
            statusStart = statusEnd;
            return segment;
        }).join(", ")})`
        : "conic-gradient(#e8ecf4 0 100%)";
    const ticketVolume = useMemo(() => {
        const latest = tickets.length ? new Date(Math.max(...tickets.map((ticket) => new Date(ticket.createdAt).getTime()))) : new Date();
        const days = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(latest);
            date.setDate(date.getDate() - 6 + index);
            const key = date.toDateString();
            return { date, key, count: reportTickets.filter((ticket) => new Date(ticket.createdAt).toDateString() === key).length };
        });
        const maximum = Math.max(1, ...days.map((day) => day.count));
        return days.map((day) => ({ ...day, height: Math.max(7, Math.round((day.count / maximum) * 100)) }));
    }, [reportTickets, tickets]);
    const tagData = useMemo(() => {
        const counts = new Map();
        reportTickets.forEach((ticket) => ticket.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
        return [...counts.entries()].sort((first, second) => second[1] - first[1]).slice(0, 6);
    }, [reportTickets]);
    const resolvedRate = reportTickets.length ? Math.round((totals.closed / reportTickets.length) * 100) : 0;

    const exportReport = () => {
        const rows = reportTickets.map((ticket) => ({
            ticket: ticket.id,
            subject: ticket.subject,
            customer: getCustomer(customers, ticket.customerId)?.name || "Former customer",
            status: ticket.status,
            priority: ticket.priority,
            channel: ticket.channel,
            assignee: ticket.assignedTo || "Unassigned",
            created: ticket.createdAt,
            lastUpdated: ticket.updatedAt,
            tags: ticket.tags.join("; "),
        }));
        if (downloadCsv(rows, "relay-support-report.csv")) addToast(`Report exported with ${rows.length} conversations`, "info");
        else addToast("No conversations in this date range", "info");
    };

    return (
        <div className={styles.reportsPage}>
            <header className={styles.heading}>
                <div><p>TEAM PERFORMANCE <FiArrowUpRight aria-hidden="true" /></p><h1>Reports</h1><span>See how conversations are moving through the desk.</span></div>
                <div className={styles.headingActions}><div aria-label="Report date range" className={styles.rangePicker}>{["7 days", "30 days", "All time"].map((option) => <button aria-pressed={range === option} className={range === option ? styles.rangeActive : styles.rangeButton} key={option} onClick={() => setRange(option)} type="button">{option}</button>)}</div><button className={styles.exportButton} onClick={exportReport} type="button"><FiDownload aria-hidden="true" /> Export CSV</button></div>
            </header>
            <div className={styles.reportNote}><FiActivity aria-hidden="true" /><span>Live view of {reportTickets.length} sample conversations. Changes you make in the inbox are reflected here during this session.</span></div>
            <section aria-label="Support performance summary" className={styles.metrics}>
                <article><span className={styles.metricIcon}><FiInbox aria-hidden="true" /></span><div><small>Tickets in range</small><strong>{reportTickets.length}</strong><span>Across all channels</span></div><i className={styles.metricAccent} /></article>
                <article><span className={styles.metricIcon} data-tone="teal"><FiCheckCircle aria-hidden="true" /></span><div><small>Resolved</small><strong>{totals.closed}</strong><span>{resolvedRate}% of ticket volume</span></div><i className={styles.metricAccent} data-tone="teal" /></article>
                <article><span className={styles.metricIcon} data-tone="amber"><FiMessageCircle aria-hidden="true" /></span><div><small>Agent response coverage</small><strong>{responseCoverage}%</strong><span>{totals.answered} conversations have a reply</span></div><i className={styles.metricAccent} data-tone="amber" /></article>
                <article><span className={styles.metricIcon} data-tone="rose"><FiUsers aria-hidden="true" /></span><div><small>Need an owner</small><strong>{totals.unassigned}</strong><span>{totals.open + totals.pending} active conversations</span></div><i className={styles.metricAccent} data-tone="rose" /></article>
            </section>
            <div className={styles.chartGrid}>
                <section aria-label="Ticket volume by day" className={styles.panel}>
                    <div className={styles.panelHeading}><div><span className={styles.panelIcon}><FiBarChart2 aria-hidden="true" /></span><span><h2>Ticket volume</h2><small>New conversations by day</small></span></div><span className={styles.panelLegend}><i /> Created</span></div>
                    <div className={styles.volumeChart}>
                        <div className={styles.chartYAxis}><span>{Math.max(1, ...ticketVolume.map((day) => day.count))}</span><span>0</span></div>
                        <div className={styles.barArea}>{ticketVolume.map((day) => <div className={styles.barColumn} key={day.key}><span className={styles.barValue}>{day.count || ""}</span><span className={styles.volumeBar} data-count={day.count} style={{ height: `${day.height}%` }} title={`${day.count} tickets`} /><small>{new Intl.DateTimeFormat("en", { weekday: "short" }).format(day.date)}</small></div>)}</div>
                    </div>
                </section>
                <section aria-label="Conversation status mix" className={styles.panel}>
                    <div className={styles.panelHeading}><div><span className={styles.panelIcon} data-tone="teal"><FiActivity aria-hidden="true" /></span><span><h2>Status mix</h2><small>Where tickets stand</small></span></div></div>
                    <div className={styles.statusSummary}><div className={styles.donut} style={{ background: statusGradient }}><span><strong>{reportTickets.length}</strong><small>tickets</small></span></div><div className={styles.statusLegend}>{statusData.map((item) => <div key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><strong>{item.count}</strong></div>)}</div></div>
                </section>
                <section aria-label="Tickets by channel" className={styles.panel}>
                    <div className={styles.panelHeading}><div><span className={styles.panelIcon} data-tone="amber"><FiMail aria-hidden="true" /></span><span><h2>Channels</h2><small>How customers reach your team</small></span></div></div>
                    <div className={styles.barList}>{channelData.map((item) => <div className={styles.barRow} key={item.name}><span>{item.name}</span><div><i style={{ width: `${Math.max(4, (item.count / channelMaximum) * 100)}%` }} /></div><strong>{item.count}</strong></div>)}</div>
                    <p className={styles.panelFootnote}>Email, chat, and web form conversations are included.</p>
                </section>
                <section aria-label="Active tickets by agent" className={styles.panel}>
                    <div className={styles.panelHeading}><div><span className={styles.panelIcon} data-tone="rose"><FiUsers aria-hidden="true" /></span><span><h2>Team workload</h2><small>Active tickets by assignee</small></span></div></div>
                    <div className={styles.agentList}>{agentData.map((item) => <div className={styles.agentRow} key={item.name}><span className={styles.agentInitials}>{item.name === "Unassigned" ? "—" : item.name.split(" ").map((part) => part[0]).join("")}</span><span className={styles.agentName}>{item.name}</span><span className={styles.agentTrack}><i style={{ width: `${Math.max(item.count ? 8 : 0, (item.count / agentMaximum) * 100)}%` }} /></span><strong>{item.count}</strong></div>)}</div>
                </section>
                <section aria-label="Most used ticket tags" className={styles.panel}>
                    <div className={styles.panelHeading}><div><span className={styles.panelIcon}><FiZap aria-hidden="true" /></span><span><h2>Common topics</h2><small>Tags used on conversations</small></span></div></div>
                    {tagData.length ? <div className={styles.topicList}>{tagData.map(([tag, count]) => <div key={tag}><span>{tag}</span><i><b style={{ width: `${Math.max(10, (count / tagData[0][1]) * 100)}%` }} /></i><strong>{count}</strong></div>)}</div> : <p className={styles.panelFootnote}>Ticket tags will appear here as conversations are categorized.</p>}
                </section>
                <section aria-label="Support response insights" className={`${styles.panel} ${styles.insightPanel}`}>
                    <div className={styles.insightIcon}><FiActivity aria-hidden="true" /></div><h2>Keep the queue balanced</h2><p>{totals.unassigned ? `${totals.unassigned} active ${totals.unassigned === 1 ? "conversation needs" : "conversations need"} an owner. Assigning them helps the team respond sooner.` : "Every active conversation has an owner. Keep an eye on open and pending work as new tickets arrive."}</p><div><span>Resolved share</span><strong>{resolvedRate}%</strong></div>
                </section>
            </div>
        </div>
    );
};

export default ReportsPage;
