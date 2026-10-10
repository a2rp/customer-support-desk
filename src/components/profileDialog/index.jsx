import { FiCheckCircle, FiUser } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const ProfileDialog = ({ onClose }) => {
    const { agent, agents, setAgent, teamSettings, setTeamSettings, addToast } = useApp();
    const updateSetting = (key) => (event) => {
        const next = { ...teamSettings, [key]: event.target.checked };
        setTeamSettings(next);
        addToast(key === "showSla" ? `SLA timers ${next[key] ? "shown" : "hidden"}` : `New ticket auto-assignment ${next[key] ? "enabled" : "paused"}`, "info");
    };

    return (
        <Modal description="Set who is working in this demo inbox and tune its team defaults." onClose={onClose} title="Agent preferences">
            <div className={styles.profile}>
                <div className={styles.identity}><span className={styles.avatar}><FiUser aria-hidden="true" /></span><span><strong>{agent}</strong><small>Customer support</small></span></div>
                <label className={styles.field}>Working as <select onChange={(event) => { setAgent(event.target.value); addToast(`You are now working as ${event.target.value}`, "info"); }} value={agent}>{agents.map((person) => <option key={person}>{person}</option>)}</select></label>
                <div className={styles.preferences}>
                    <label><span><strong>Show SLA timers</strong><small>Display response-time targets in the inbox.</small></span><input checked={teamSettings.showSla} onChange={updateSetting("showSla")} type="checkbox" /></label>
                    <label><span><strong>Auto-assign new tickets</strong><small>Assign new tickets to the current agent.</small></span><input checked={teamSettings.autoAssign} onChange={updateSetting("autoAssign")} type="checkbox" /></label>
                </div>
                <p className={styles.note}><FiCheckCircle aria-hidden="true" /> These preferences apply to this page session only.</p>
                <button className={styles.done} onClick={onClose} type="button">Done</button>
            </div>
        </Modal>
    );
};

export default ProfileDialog;
