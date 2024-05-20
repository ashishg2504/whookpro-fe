import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.css';
import { storeToken } from '../../utils/AuthStorage';
import { ToastContainer, toast } from 'react-toastify';

function RegisterForm() {
    const history = useHistory();
    const [formField, setFormField] = useState({
        email: "",
        password: "",
        fullName: ""
    })

    // Handle signUp
    const handleSignUp = async () => {
        try {
            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

            if (!passwordRegex.test(formField.password)) {
                toast.error("Password should contain atleast 6 character, Alphanumeric, One Uppercase letter, One lowercase letter, One Symbol")
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/user/signUp`,
                formField,
                {
                    headers: {
                        "content-type": "application/json "
                    }
                }
            );
            toast.success("User Registered Successfully")
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
                    handleSignUp();
                }}
            >
                <input
                    className={styles['input-field']}
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Name"
                    value={formField.fullName}
                    onChange={(e) => handleFormChange(e)}
                    required
                />
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
                    Register
                </button>
            </form>
        </>
    )
}

export default RegisterForm