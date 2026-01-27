import { Link } from "react-router"
import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import CareerOpsLogo from "../../assets/CareerOpsLogo.png"
import styles from "./NavBar.module.css"

const NavBar = () => {
  const { user, setUser } = useContext(UserContext)

  const handleSignOut = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.brand}><img src={CareerOpsLogo} alt="CareerOps Logo" />
        <h2>CareerOps</h2></li>
        <li className={styles.right}>
          <ul className={styles.linkGroup}>
            {user ? (
              <>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/application/new" className={styles.primary}>New Application</Link></li>
                <li><Link onClick={handleSignOut} to="/">Sign Out</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/sign-up">Sign Up</Link></li>
                <li><Link to="/sign-in">Sign In</Link></li>
              </>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
