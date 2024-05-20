import { useEffect, useState } from 'react';
import styles from './login.module.css';
import { useHistory } from 'react-router-dom';
import { getToken } from '../../utils/AuthStorage';
import LoginForm from './LoginForm';
import RegisterForm from './registerForm';

function Login() {
  const history = useHistory();
  const [currentScreen, setCurrentScreen] = useState("login")

  useEffect(() => {
    if (getToken()) {
      history.push("/home")
    }
  }, [])

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-body']}>
        <h1 className={styles['font-seorge']}>Welcome {currentScreen === "login" ? "Back" : ""}</h1>
        {
          currentScreen === "login" ?
            <p className={styles['font-seorge']}>Please login to your account</p>
            :
            <></>
        }
        {
          currentScreen === "login" ?
            <LoginForm />
            :
            <RegisterForm />
        }
        {
          currentScreen === "login" ?
            <h3 style={{
              cursor: "pointer",
            }}
              onClick={() => { setCurrentScreen("signup") }}>Need an account?</h3>
            :
            <h3 style={{
              cursor: "pointer",
            }} className='hypertext' onClick={() => { setCurrentScreen("login") }}>Have an account?</h3>
        }
      </div>
    </div>
  );
}

export default Login;
