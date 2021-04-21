import styles from ' ./styles.module.scss'

export default function Header() {
    return(
        <header className={styles.HeaderContainer}>
            <img src="/logo.svg" alt="logo"/>
            <p>O melhor para você ouvir, sempre</p>
            <span>Qui, 8 de Abril</span>
        </header>
    )
}