import React, { useContext , useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import './SignupPage.css'

const SignupPage = () => {

    const {signupUser} = useContext(AuthContext)
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const signupHandler = (e) => {
        e.preventDefault()        
        setLoading(true)
        if (e.target.username.value == '' || e.target.password.value == '' || e.target.pwdConfirmation.value=='') {
            setErrorMsg('Do not leave empty');
        } else if (e.target.password.value != e.target.pwdConfirmation.value) {
            setErrorMsg('Passwords do not match');
        } else{
            setErrorMsg('');
            signupUser(e);
        }   
    }

    return (
        <div className='signupContainer'>
            <div className='sformContainer'>
                <p>SIGN UP</p>
                <form onSubmit={signupHandler}>
                    <label for="username">Username</label>
                    <input type="text" className='textInput' name="username" placeholder="Enter Username" />
                    <label for="password">Password</label>
                    <input type="password" className='textInput' name="password" placeholder="Enter Password" />
                    <label for="password">Password Confirmation</label>
                    <input type="password" className='textInput'name="pwdConfirmation" placeholder="Confirm Password" />
                    {/* <input type="button" id='submitButton' value='Create Account' onClick={ e => {signupHandler(e);}}/> */}
                    <p id='errorMsg'>{ errorMsg }</p>
                    <input type="submit" id='createButton' value='Create Account' disabled={loading}/>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
