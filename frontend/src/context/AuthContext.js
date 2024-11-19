import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    const [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();

        const loginData = {
            username: e.target.username.value,
            password: e.target.password.value
        };

        try {
            const response = await axios.post('/api/token/', loginData);
        
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Username or password incorrect');
            } else {
                alert("Error during login:", error);
            }
        }
    };

    const logoutUser = async () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('./login');
    };

    const signupUser = async (e) => {
        e.preventDefault();

        const signupData = {
            username: e.target.username.value,
            password: e.target.password.value
        };

        try {
            await axios.post('/api/signup/', signupData);

            alert('Account created. Please login.');
            navigate('./login');
        } catch (error) {
            alert("Error during signup:", error);
        }
    };

    const updateToken = async () => {
        const updateData = {
            refresh: authTokens?.refresh
        }
        
        try {
            const response = axios.post('/api/refresh/', updateData);

            setAuthTokens(response.data)
            setUser(jwtDecode(response.data.access))
            localStorage.setItem('authTokens', JSON.stringify(response.data))
        } catch (error) {
            logoutUser();
        }

        if(loading){
            setLoading(false);
        }
    };

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        signupUser: signupUser,
    }

    useEffect(() => {
        if (loading) {
            updateToken();
        };

        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes);

        return () => clearInterval(interval)
        // eslint-disable-next-line
    }, [authTokens, loading]);

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    );

};
