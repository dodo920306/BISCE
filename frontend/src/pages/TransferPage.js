import React, {useState, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import './TransferPage.css'
import axios from 'axios';

const TransferPage = () => {

    const {authTokens} = useContext(AuthContext);

    const [balanceOf, setBalanceOf] = useState(null);
    const [balanceOfAccount, setBalanceOfAccount] = useState(null);
    const [showBalanceOf, setShowBalanceOf] = useState(false);

    const [transferRecipient, setTransferRecipient] = useState(null);
    const [transferAmount, setTransferAmount] = useState(null);
    const [showTransfer, setShowTransfer] = useState(false);
    const [transferStatus, setTransferStatus] = useState(null);

    const [approveSpender, setApproveSpender] = useState(null);
    const [approveValue, setApproveValue] = useState(null);
    const [approveStatus, setApproveStatus ] = useState(null);
    const [showApprove, setShowApprove] = useState(false);

    const [allowanceOwner, setAllowanceOwner] = useState(null);
    const [allowanceSpender, setAllowanceSpender] = useState(null);
    const [allowanceStatus, setAllowanceStatus] = useState(null);
    const [showAllowance, setShowAllowance] = useState(false);

    const [tfFrom, setTfFrom] = useState(null);
    const [tfTo, setTfTo] = useState(null);
    const [tfValue, setTfValue] = useState(null);
    const [tfStatus, setTfStatus] = useState(null);
    const [showTf, setShowTf] = useState(false);

    const [usedBalanceOf, setUsedBalanceOf] = useState(null);
    const [usedBalanceOfAccount, setUsedBalanceOfAccount] = useState(null);
    const [showUsedBalanceOf, setShowUsedBalanceOf] = useState(false);

    const [useRecipient, setUseRecipient] = useState(null);
    const [useAmount, setUseAmount] = useState(null);
    const [showUse, setShowUse] = useState(false);
    const [useStatus, setUseStatus] = useState(null);

    const [useFrom, setUseFrom] = useState(null);
    const [useTo, setUseTo] = useState(null);
    const [useValue, setUseValue] = useState(null);
    const [useFromStatus, setUseFromStatus] = useState(null);
    const [showUseFrom, setShowUseFrom] = useState(false);

    const [mint, setMint] = useState(null);
    const [mintStatus, setMintStatus] = useState(null);
    const [showMint, setShowMint] = useState(false);

    const [burn, setBurn] = useState(null);
    const [burnStatus, setBurnStatus] = useState(null);
    const [showBurn, setShowBurn] = useState(false);

    const fetchBalanceOf = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=balanceOf%20${balanceOfAccount}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setBalanceOf(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const fetchTransfer = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=transfer%20${transferRecipient}%20${transferAmount}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setTransferStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const fetchApprove = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=approve%20${approveSpender}%20${approveValue}`, {
                headers:{

                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setApproveStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    }

    const fetchAllowance = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=allowance%20${allowanceOwner}%20${allowanceSpender}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setAllowanceStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    }

    const fetchTransferFrom = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=transferFrom%20${tfFrom}%20${tfTo}%20${tfValue}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setTfStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    }

    const fetchUsedBalanceOf = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=usedBalanceOf%20${usedBalanceOfAccount}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setUsedBalanceOf(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const fetchUse = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=use%20${useRecipient}%20${useAmount}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setUseStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const fetchUseFrom = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=useFrom%20${useFrom}%20${useTo}%20${useValue}`, {
                headers:{
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setUseFromStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    }

    const fetchMint = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=mint%20${mint}`, {
                headers: {
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setMintStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const fetchBurn = async () => {
        try {
            const response = await axios.get(`/api/query/?cmd=burn%20${burn}`, {
                headers: {
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            });
            setBurnStatus(response.data.result);
        } 
        catch (error) {
            alert("error: ", error);
        }
    };

    const balanceOfAccountHandler = (e) => {
        setBalanceOfAccount(e.target.value);
    };
    const transferRecipientHandler = (e) => {
        setTransferRecipient(e.target.value);
    };
    const transferAmountHandler = (e) => {
        setTransferAmount(e.target.value);
    };
    const approveSenderHandler = (e) => {
        setApproveSpender(e.target.value);
    };
    const appoveValueHandler = (e) => {
        setApproveValue(e.target.value);
    };
    const allowanceOwnerHandler = (e) => {
        setAllowanceOwner(e.target.value);
    };
    const allowanceSpenderHandler = (e) => {
        setAllowanceSpender(e.target.value);
    };
    const tfFromHandler = (e) => {
        setTfFrom(e.target.value);
    };
    const tfToHandler = (e) => {
        setTfTo(e.target.value);
    };
    const tfValueHandler = (e) => {
        setTfValue(e.target.value);
    };
    const balanceOfUsedAccountHandler = (e) => {
        setUsedBalanceOfAccount(e.target.value);
    };
    const balanceOfUsedHandler = (e) => {
        fetchUsedBalanceOf();
    };
    const useRecipientHAndler = (e) => {
        setUseRecipient(e.target.value);
    };
    const useAmountHandler = (e) => {
        setUseAmount(e.target.value);
    };
    const useFromHandler = (e) => {
        setUseFrom(e.target.value);
    };
    const useToHandler = (e) => {
        setUseTo(e.target.value);
    };
    const useValueHandler = (e) => {
        setUseValue(e.target.value);
    };
    const mintValueHandler = (e) => {
        setMint(e.target.value);
    };
    const burnValueHandler = (e) => {
        setBurn(e.target.value);
    };

    return (
        <div className='transferContainer'>
            <div className='functionsContainer'>
                <div className='funcCat'>Search</div>
                <i class='fa fa-search' ></i>
                <div className='funcDropContainer' >
                    <div className='funcItemContainer' onClick={() => { 
                            setBalanceOfAccount(null); 
                            setBalanceOf("");
                            setShowBalanceOf(!showBalanceOf);
                        }}>
                        <p>Search for the balance of an account</p>
                    </div>
                </div>
                { showBalanceOf && 
                    (
                        <div className='infoContainer'>
                            <div className='infoItemContainer'>
                                <input onChange={ balanceOfAccountHandler } placeholder='Account'></input>
                            </div>
                            <div className='infoItemContainer'>
                                <button id='transferFunc' onClick={ fetchBalanceOf } >Submit</button>
                            </div>
                            <div className='resultContainer'>{ balanceOf }</div>
                        </div>
                    )
                }
                <div className='funcDropContainer' >
                    <div className='funcItemContainer' onClick={() => { 
                            setUsedBalanceOfAccount(null); 
                            setUsedBalanceOf("");
                            setShowUsedBalanceOf(!showUsedBalanceOf);
                        }}>
                        <p>Search for the used balance of an account</p>                
                    </div>
                </div>
                { showUsedBalanceOf && 
                    (   
                        <div className='infoContainer'>
                            <div className='infoItemContainer'>
                                <input onChange={ balanceOfUsedAccountHandler } placeholder='Account'></input>
                            </div>
                            <div className='infoItemContainer'>
                                <button id='transferFunc' onClick={ balanceOfUsedHandler } >Submit</button>
                            </div>
                            <div className='resultContainer'>{ usedBalanceOf }</div>
                        </div>
                    )
                }
                <div className='funcDropContainer'>
                    <div className='funcItemContainer' 
                        onClick={() => { 
                            setAllowanceOwner(null); 
                            setAllowanceSpender(null);
                            setShowAllowance(!showAllowance) 
                            setAllowanceStatus(null);
                        }}>
                        {/* <i class="fa-sharp fa-solid fa-coins" ></i> */}
                        <p>Search for the amount still available for the client account to withdraw from the owner account</p>
                    </div>
                    {
                        showAllowance && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ allowanceOwnerHandler } placeholder='Owner Address'></input>
                                    <input onChange={ allowanceSpenderHandler } placeholder='Client Address'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchAllowance } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ allowanceStatus }</div>
                            </div>
                            
                        )
                    }
                </div>
                <div className='funcCat'>Transfer</div>
                <i class="fa fa-send"></i>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setTransferRecipient(null); 
                            setTransferAmount(null);
                            setShowTransfer(!showTransfer) 
                            setTransferStatus(null);
                        }}>
                        <p>Send tokens to recipient account</p>
                    </div>
                    {
                        showTransfer && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ transferRecipientHandler } placeholder='Recipient Address'></input>
                                    <input onChange={ transferAmountHandler } placeholder='Transfer Amount'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchTransfer } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ transferStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setTfFrom(null); 
                            setTfTo(null);
                            setTfValue(null);
                            setShowTf(!showTf) 
                            setTfStatus(null);
                        }}>
                        {/* <i class="fa-solid fa-money-bill-transfer"></i> */}
                        <p>Transfer the value amount from a specific account to another</p>
                    </div>
                    {
                        showTf && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ tfFromHandler } placeholder='From address'></input>
                                    <input onChange={ tfToHandler } placeholder='To address'></input>
                                    <input onChange={ tfValueHandler } placeholder='Value'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchTransferFrom } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ tfStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcCat'>Allowance</div>
                <i class="fa-solid fa-user-check"></i>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setApproveSpender(null); 
                            setApproveValue(null);
                            setShowApprove(!showApprove) 
                            setApproveStatus(null);
                        }}>
                        <p>Allow an account to withdraw from your account</p>
                    </div>
                    {
                        showApprove && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ approveSenderHandler } placeholder='Address'></input>
                                    <input onChange={ appoveValueHandler } placeholder='Value'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchApprove } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ approveStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcCat'>Use</div>
                <i class="fa-solid fa-shop"></i>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setUseRecipient(null); 
                            setUseAmount(null);
                            setShowUse(!showUse) 
                            setUseStatus(null);
                        }}>
                        <p>Use recipient account's tokens</p>
                    </div>
                    {
                        showUse && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ useRecipientHAndler } placeholder='Recipient Address'></input>
                                    <input onChange={ useAmountHandler } placeholder='Use Amount'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchUse } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ useStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setUseFrom(null); 
                            setUseTo(null);
                            setUseValue(null);
                            setShowUseFrom(!showUseFrom) 
                            setUseFromStatus(null);
                        }}>
                        <p>Uses the value amount of a specific account to another</p>
                    </div>
                    {
                        showUseFrom && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ useFromHandler } placeholder='From address'></input>
                                    <input onChange={ useToHandler } placeholder='To address'></input>
                                    <input onChange={ useValueHandler } placeholder='Use Amount'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchUseFrom } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ useFromStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcCat'>Demo use only</div>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setMint(null); 
                            setShowMint(!showMint) 
                        }}>
                        <p>Mint carbon tokens</p>
                    </div>
                    {
                        showMint && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ mintValueHandler } placeholder='Amount'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchMint } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ mintStatus }</div>
                            </div>
                        )
                    }
                </div>
                <div className='funcDropContainer'>
                    <div className='funcItemContainer'
                        onClick={() => { 
                            setBurn(null); 
                            setShowBurn(!showBurn) 
                        }}>
                        <p>Burn carbon tokens</p>
                    </div>
                    {
                        showBurn && 
                        (
                            <div className='infoContainer'>
                                <div className='infoItemContainer'>
                                    <input onChange={ burnValueHandler } placeholder='Amount'></input>
                                </div>
                                <div className='infoItemContainer'>
                                    <button id='transferFunc' onClick={ fetchBurn } >Submit</button>
                                </div>
                                <div className='resultContainer'>{ burnStatus }</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default TransferPage;
