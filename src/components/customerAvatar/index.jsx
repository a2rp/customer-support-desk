import styles from "./styles.module.css";

const CustomerAvatar = ({ customer, className = "" }) => (
    <span aria-hidden="true" className={`${styles.avatar} ${className}`} data-color={customer?.color || "blue"}>
        {customer?.avatar || customer?.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?"}
    </span>
);

export default CustomerAvatar;
