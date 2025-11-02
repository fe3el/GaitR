import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar(){
    return(
        <nav className={styles.navbar}>
            <img src="/assets/logo.png" alt="Logo" className={styles.logo} />
        </nav>
    )
}