import styles from "../styles/footer.module.css";
import { footer } from "../config/ICAR-Config";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p style={{ marginTop: '1rem' }}>
        {footer.text}{" "}
        <a
          href={footer.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          style={{ color: footer.linkColor }} 
        >
          {footer.linkText}
        </a>
      </p>
    </footer>
  );
}

export default Footer;
