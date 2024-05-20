import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.css';
import { storeToken } from '../../utils/AuthStorage';
import { ToastContainer, toast } from 'react-toastify';

function LoginForm() {
    const history = useHistory();
    const [formField, setFormField] = useState({
        email: "",
        password: ""
    })

    // Handle Login 
    const handlelogin = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/user/login`,
                formField,
                {
                    headers: {
                        "content-type": "application/json "
                    }
                }
            );
            toast.success("Login Successfully")
            storeToken(response.data.data.token);
            history.push('/home');
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    };

    //Handle form change 
    const handleFormChange = (e) => {
        setFormField((prevState) => {
            let form = { ...prevState }
            form[e.target.name] = e.target.value
            return form
        })
    }

    return (
        <>
            <ToastContainer />
            <form
                className={styles['login-form']}
                onSubmit={(e) => {
                    e.preventDefault();
                    handlelogin();
                }}
            >
                <input
                    className={styles['input-field']}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formField.email}
                    onChange={(e) => handleFormChange(e)}
                    required
                />
                <input
                    className={styles['input-field']}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formField.password}
                    onChange={(e) => handleFormChange(e)}
                    required
                />
                <button
                    className={styles['submit-btn']}
                    style={{ background: '#FF5500' }}
                    type="submit"
                >
                    Login
                </button>
            </form>
        </>
    )
}

export default LoginForm