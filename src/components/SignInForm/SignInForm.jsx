import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService'; // this is excplicitly importing the signIn function from authService
import { UserContext } from '../../contexts/UserContext';
import styles from "./SignInForm.module.css"

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
   <main className={styles.main}>
      <h1 className={styles.title}>Sign In</h1>
      <form className={styles.form} autoComplete='off' onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='email'>Username:</label>
          <input
            className={styles.input}
            type='text'
            autoComplete='off'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='password'>Password:</label>
          <input
            className={styles.input}
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.button}>Sign In</button>
          <button className={`${styles.button} ${styles.secondary}`} onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;

