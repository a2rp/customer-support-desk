import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiCodepen, FiCoffee, FiGlobe, FiHeart, FiMail } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", detail: "ashishranjan.net", href: "https://www.ashishranjan.net", icon: FiGlobe },
    { label: "GitHub", detail: "github.com/a2rp", href: "https://github.com/a2rp", icon: FaGithub },
    { label: "CodePen", detail: "codepen.io/ash1198", href: "https://codepen.io/ash1198", icon: FiCodepen },
    { label: "LinkedIn", detail: "linkedin.com/in/aashishranjan", href: "https://www.linkedin.com/in/aashishranjan", icon: FaLinkedinIn },
    { label: "Facebook", detail: "facebook.com/theash.ashish", href: "https://www.facebook.com/theash.ashish/", icon: FaFacebookF },
    { label: "YouTube", detail: "youtube.com/@ashishranjan-ashz", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FaYoutube },
    { label: "Email", detail: "ash.ranjan09@gmail.com", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
    { label: "Support", detail: "a2rp-donation-page.netlify.app", href: "https://a2rp-donation-page.netlify.app/", icon: FiHeart },
    { label: "Buy Me a Coffee", detail: "buymeacoffee.com/ashishranjan", href: "https://buymeacoffee.com/ashishranjan", icon: FiCoffee },
    { label: "Source code", detail: "github.com/a2rp/customer-support-desk", href: "https://github.com/a2rp/customer-support-desk", icon: FaGithub },
];

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.copyright}>
            <a aria-label="Ashish Ranjan portfolio" href="https://www.ashishranjan.net" rel="noreferrer" target="_blank"><img alt="" src={import.meta.env.BASE_URL + "logo.png"} /><strong>relay<span>.</span></strong></a>
            <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" rel="noreferrer" target="_blank">Ashish Ranjan</a>. All rights reserved.</p>
        </div>
        <nav aria-label="Social and project links" className={styles.links}>
            {links.map((link) => {
                const Icon = link.icon;
                const external = link.href.startsWith("http");
                return <a aria-label={link.label} className={styles.link} data-tooltip-content={`${link.label}\n${link.detail}`} data-tooltip-id="relay-footer-tooltip" href={link.href} key={link.label} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>
                    <Icon aria-hidden="true" />
                </a>;
            })}
            <Tooltip className={styles.tooltip} id="relay-footer-tooltip" place="top" variant="dark" />
        </nav>
    </footer>
);

export default Footer;
