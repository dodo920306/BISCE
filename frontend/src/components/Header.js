import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import "./Header.css"
import logo from '../images/logo_website.png';

const Header = () => {

    const {user, logoutUser} = useContext(AuthContext);

    return (
        <div className='headerContainer'>
            <ul>
                <li id='navLogo'><Link to="/"><img src={logo} alt="Logo" /></Link></li>
                <li id='navTransfer'><Link to="/transfer" className='navLink'>Transfer</Link></li>
                <li id='navLogin'>
                    {user && <span id='welcomeMsg'>Welcome, {user.username} !</span>}
                    {user ? (
                        <button id='logoutButton' onClick={logoutUser}>Logout</button>
                    ): (
                        <Link to="/login" className='navLink'>Login</Link>
                    )}
                </li>
            </ul>
        </div>
    );

};

export default Header;
