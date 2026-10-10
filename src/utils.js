const getCustomer = (customers, customerId) =>
    customers.find((customer) => customer.id === customerId);

const formatRelativeTime = (value) => {
    const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
};

const formatMessageTime = (value) => new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
}).format(new Date(value));

const downloadCsv = (rows, fileName) => {
    if (!rows.length) return false;
    const columns = Object.keys(rows[0]);
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [columns.map(quote).join(","), ...rows.map((row) => columns.map((column) => quote(row[column])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
};

export { downloadCsv, formatMessageTime, formatRelativeTime, getCustomer };
