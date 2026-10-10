import { useEffect, useMemo, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiMenu, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import CustomerAvatar from "../customerAvatar";
import styles from "./styles.module.css";

const Header = () => {
    const { tickets, customers, openDialog, mobileNavOpen, setMobileNavOpen } = useApp();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const results = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return [];
        const ticketResults = tickets.filter((ticket) => {
            const customer = customers.find((item) => item.id === ticket.customerId);
            return [ticket.id, ticket.subject, customer?.name, customer?.company].join(" ").toLowerCase().includes(term);
        }).slice(0, 5).map((ticket) => ({ type: "ticket", item: ticket }));
        const customerResults = customers.filter((customer) => [customer.name, customer.company, customer.email].join(" ").toLowerCase().includes(term)).slice(0, 3).map((customer) => ({ type: "customer", item: customer }));
        return [...ticketResults, ...customerResults].slice(0, 6);
    }, [customers, query, tickets]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setSearchOpen(true);
                inputRef.current?.focus();
            }
            if (event.key === "Escape") setSearchOpen(false);
        };
        const onPointerDown = (event) => {
            if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, []);

    const openResult = (result) => {
        if (result.type === "ticket") navigate(`/inbox?ticket=${encodeURIComponent(result.item.id)}`);
        else navigate(`/customers?customer=${encodeURIComponent(result.item.id)}`);
        setQuery("");
        setSearchOpen(false);
    };
    const submitSearch = (event) => {
        event.preventDefault();
        if (results[0]) openResult(results[0]);
        else if (query.trim()) navigate(`/inbox?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <header className={styles.header}>
            <button aria-expanded={mobileNavOpen} aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} className={styles.mobileMenu} onClick={() => setMobileNavOpen(!mobileNavOpen)} type="button"><FiMenu aria-hidden="true" /></button>
            <div className={styles.searchWrap} ref={searchRef}>
                <form className={styles.search} onSubmit={submitSearch} role="search">
                    <FiSearch aria-hidden="true" />
                    <input aria-label="Search tickets and customers" autoComplete="off" onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search tickets or customers" ref={inputRef} value={query} />
                    {query && <button aria-label="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }} type="button"><FiX aria-hidden="true" /></button>}
                    {!query && <kbd>Ctrl K</kbd>}
                </form>
                {searchOpen && query.trim() && <div className={styles.results} role="listbox" aria-label="Search results">
                    {results.length ? results.map((result) => <button className={styles.result} key={`${result.type}-${result.item.id}`} onClick={() => openResult(result)} role="option" type="button">
                        {result.type === "ticket" ? <span className={styles.ticketMark}>#{result.item.id.slice(-4)}</span> : <CustomerAvatar className={styles.resultAvatar} customer={result.item} />}
                        <span><strong>{result.type === "ticket" ? result.item.subject : result.item.name}</strong><small>{result.type === "ticket" ? `${result.item.id} · ${result.item.status}` : `${result.item.company} · ${result.item.email}`}</small></span>
                    </button>) : <p className={styles.noResults}>No matches. Press Enter to search inbox.</p>}
                </div>}
            </div>
            <div className={styles.actions}>
                <span className={styles.online}><i /> Team online</span>
                <button className={styles.newTicket} onClick={() => openDialog("ticketForm")} type="button"><FiPlus aria-hidden="true" /><span>New ticket</span></button>
                <a aria-label="Open public repository" className={styles.repository} href="https://github.com/a2rp/customer-support-desk" rel="noreferrer" target="_blank"><FaGithub aria-hidden="true" /><span>Repository</span></a>
            </div>
        </header>
    );
};

export default Header;
