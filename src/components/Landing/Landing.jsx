import { Link } from "react-router"
import CareerOpsLogo from "../../assets/CareerOpsLogo.png"
import styles from "./Landing.module.css"

const Landing = () => {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>

        <div className={styles.brandRow}>
          <div className={styles.logoWrapper}>
            <img src={CareerOpsLogo} alt="CareerOps Logo" />
          </div>

          <h1 className={styles.title}>Welcome to CareerOps</h1>
        </div>

        <p className={styles.subtitle}>
          Track job applications, manage next actions, and understand your
          job search progress — all in one place.
        </p>

        <p className={styles.description}>
          Create an account to organize your applications, or sign in to
          access your personalized dashboard and analytics.
        </p>

        <div className={styles.actions}>
          <Link to="/auth/signup" className={styles.primaryButton}>Create Account</Link>
          <Link to="/auth/signin" className={styles.secondaryButton}>Sign In</Link>
        </div>
      </section>
    </main>
  )
}

export default Landing
