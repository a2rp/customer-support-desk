import { FiBarChart2, FiInbox, FiUsers, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const navigation = [
    { to: "/inbox", label: "Inbox", icon: FiInbox },
    { to: "/customers", label: "Customers", icon: FiUsers },
    { to: "/reports", label: "Reports", icon: FiBarChart2 },
];

const Sidebar = () => {
    const { tickets, customers, agent, openDialog, mobileNavOpen, setMobileNavOpen } = useApp();
    const unreadCount = tickets.filter((ticket) => ticket.unread && ticket.status !== "Closed").length;

    return (
        <>
            <button aria-label="Close navigation" className={mobileNavOpen ? styles.backdropOpen : styles.backdrop} onClick={() => setMobileNavOpen(false)} tabIndex={mobileNavOpen ? 0 : -1} type="button" />
            <aside aria-hidden={!mobileNavOpen && window.innerWidth <= 720} className={mobileNavOpen ? styles.sidebarOpen : styles.sidebar}>
                <NavLink aria-label="Relay inbox" className={styles.brand} onClick={() => setMobileNavOpen(false)} to="/inbox">
                    <span className={styles.brandIcon} aria-hidden="true"><FiInbox /></span>
                    <span><strong>relay<span>.</span></strong><small>SUPPORT DESK</small></span>
                </NavLink>
                <div className={styles.sectionLabel}>WORKSPACE</div>
                <nav aria-label="Primary navigation" className={styles.navigation}>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.link} key={item.to} onClick={() => setMobileNavOpen(false)} to={item.to}>
                            <Icon aria-hidden="true" />
                            <span>{item.label}</span>
                            {item.to === "/inbox" && unreadCount > 0 && <small>{unreadCount}</small>}
                            {item.to === "/customers" && <small>{customers.length}</small>}
                        </NavLink>;
                    })}
                </nav>
                <div className={styles.queueCard}>
                    <span className={styles.queueIcon} aria-hidden="true"><FiInbox /></span>
                    <span><strong>Team inbox</strong><small>{tickets.filter((ticket) => ticket.status !== "Closed").length} active conversations</small></span>
                    <i />
                </div>
                <div className={styles.sidebarBottom}>
                    <div className={styles.teamStatus}><span /><span>All systems operational</span></div>
                    <button className={styles.agentButton} onClick={() => openDialog("profile")} type="button">
                        <span className={styles.agentAvatar}>{agent.split(" ").map((part) => part[0]).join("")}</span>
                        <span><strong>{agent}</strong><small>Support agent</small></span>
                        <span className={styles.closeIcon}><FiX aria-hidden="true" /></span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
