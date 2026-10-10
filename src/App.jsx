import styles from "./App.module.css";

const App = () => (
    <main className={styles.app}>
        <div className={styles.message}>
            <span className={styles.mark} aria-hidden="true">R</span>
            <p>Relay support desk is getting ready.</p>
        </div>
    </main>
);

export default App;
