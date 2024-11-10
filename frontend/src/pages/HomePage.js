import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import './HomePage.css'
import TransactionItem from '../components/TransactionItem'
import axios from 'axios';

const HomePage = () => {
    const {authTokens} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [balance, setBalance] = useState(null);

    const [clientID, setClientID] = useState(null);
    const [croppedID, setCroppedID] = useState(null);

    const [totalSupply, setTotalSupply] = useState(null);

    const [txMap, setTxMap] = useState(null);

    const [usedBalance, setUsedBalance] = useState(null);

    const sliceID = (input) => {
        return input.length > 10 ? `${input.substring(0, 5)}...${input.substring(input.length-5, input.length)}` : input;
    };

    const fetchBalance = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=clientAccountBalance`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setBalance(response.data.result);
        } catch (error) {
            alert("error: ", error);
        }
    };

    const fetchUsedBalance = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=clientAccountUsedBalance`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setUsedBalance(response.data.result);
        } catch (error) {
            alert("error: ", error);
        }
    };

    const fetchClientID = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=clientAccountID`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setClientID(response.data.result);
            setCroppedID(sliceID(response.data.result));
        } catch (error) {
            alert("error: ", error);
        }
    };

    const fetchTotalSupply = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=totalSupply`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setTotalSupply(response.data.result);
        } catch (error) {
            alert("error: ", error);
        }
    };

    const fetchTX = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/tx/`, {
                headers: {
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setTxMap(response
                .data
                .output
                .slice(Math.max(0, response.data.output.length - 10), response.data.output.length)
                .reverse()
                .map((value) => {
                    return <TransactionItem 
                        Time={value.Timestamp}
                        TransactionID={value.TransactionID} 
                        BlockNumber={value.BlockNumber} 
                        EventName={value.EventName} 
                        From={value.Payload.from} 
                        To={value.Payload.to} 
                        Value={value.Payload.value}/>;
                }));
        } catch (error) {
            alert("error: ", error);
        }
        setLoading(false);
    };

    useEffect(() => {

        fetchBalance(); // on first render, refresh
        fetchClientID();
        fetchTotalSupply();
        fetchUsedBalance();
        fetchTX();

        const interval = setInterval(() => {
            fetchBalance();
        }, 100000); /* 10000 ten sec*/

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const securedCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text).catch(error => {
            alert('Unable to copy to clipboard: ', error);
        });
    };

    return (
      <div className='homeContainer'>
        <div className='dashContainer'>
            <div className='tokenContainer'>
                <p id='balanceTitle'>Carbon Tokens:</p>
                <p id='tokenNumber'>{ balance }</p>
                {/* <p id='tokenUnit'>carbon tokens</p> */}
            </div>
            <div className='supplyContainer'>
                <p id='supplyTitle'>Emission Tokens: </p>
                <p id='supplyDisplay'>{ usedBalance }</p>
            </div>
            <div className='supplyContainer'>
                <p id='supplyTitle'>Total Supply: </p>
                <p id='supplyDisplay'>{ totalSupply }</p>
            </div>
            <div className='idContainer'>
                <p id='idTitle'>Member ID: </p>
                <p id='idDisplay'>{ croppedID }</p>
                <button id='copyButton' 
                    onClick={ () => { 
                        securedCopyToClipboard(clientID);
                    } }>
                    <i class="fa fa-copy"></i>
                </button>
                <div className='tipCopy'>
                    Copy
                </div>
            </div>
        </div>
        <div className='transactionsContainer'>
            <p id='txTitle'>Recent Transactions</p>
            <li className='colTitle'>
                <span>Time</span>
				<span>Transaction ID</span>
				<span>Event</span>
				<span>From</span>
				<span>To</span>
                <span>Value</span>
			</li>
            { txMap }
            { loading && <div id='loadingIcon' ><i class="fa fa-spinner fa-spin" ></i> </div>}
        </div>
      </div>
    )
}

export default HomePage;
