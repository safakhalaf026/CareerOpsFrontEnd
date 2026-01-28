import { useState,useContext } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService'
import { UserContext } from '../../contexts/UserContext';
import styles from './SignUpForm.module.css'

const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    passwordConf: '',
  });
  const {setUser} = useContext(UserContext)
  const { username,displayName, email, password, passwordConf } = formData;

  const handleChange = (event) => {
    setMessage('');
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await authService.signUp(formData)
    setUser(user); 
    navigate('/')
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Sign Up</h1>
      <p className={styles.message}>{message}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='username'>Username:</label>
          <input
            className={styles.input}
            type='text'
            id='name'
            value={username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='displayName'>Display Name:</label>
          <input
            className={styles.input}
            type='text'
            id='displayName'
            value={displayName}
            name='displayName'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='email'>Email:</label>
          <input
            className={styles.input}
            type='text'
            id='email'
            value={email}
            name='email'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='password'>Password:</label>
          <input
            className={styles.input}
            type='password'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='confirm'>Confirm Password:</label>
          <input
            className={styles.input}
            type='password'
            id='confirm'
            value={passwordConf}
            name='passwordConf'
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.button} disabled={isFormInvalid()}>Sign Up</button>
          <button className={`${styles.button} ${styles.secondary}`} onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
