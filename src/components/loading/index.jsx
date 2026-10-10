import styles from "./styles.module.css";

const Loading = () => (
    <div aria-label="Loading" className={styles.loading} role="status">
        <span />
        <span />
    </div>
);

export default Loading;
