import React, { useContext , useEffect} from 'react'
import { useNavigate  } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './LoginPage.css'

const LoginPage = () => {
    const {user, loginUser} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        // eslint-disable-next-line
    }, [ user ]);

    return (
        <div className='loginContainer'>
            <div className='formContainer'>
                <p>LOGIN</p>
                <form onSubmit={loginUser}>
                    <label for="username">Username</label>
                    <input type="text" className='textInput' name="username" placeholder="Enter Username" />
                    <label for="password">Password</label>
                    <input type="password" className='textInput' name="password" placeholder="Enter Password" />
                    <input type="submit" id='submitButton' value='Login'/>
                    <p id='signupLink'>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
