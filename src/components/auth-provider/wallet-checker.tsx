import * as React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {IRootState} from "../../redux/root.reducer";
const queryString = require('query-string');

export function WalletChecker({children}: { children: JSX.Element }) {
    const location = useLocation();
    const unlocked = useSelector((state: IRootState) => state.walletState.unlocked);
    const walletString = localStorage.getItem('wallet');

    
    // Check if navigation params exist in url (if opened from a website)
    const params = queryString.parse(location.search);
    let originSender = params.originSender;
    let tabIdSender = params.tabIdSender;
    let navigateTo = params.navigateTo;
    let data = params.data;

    if(unlocked) {
        const loadedWallet = useSelector((state: IRootState) => state.walletState.wallet);
        if (loadedWallet && loadedWallet.baseAddress) {
            return children;
        }
    }
    if (walletString) {
        return <Navigate to = {'/login?navigateTo=' + navigateTo + '&tabIdSender=' + tabIdSender + '&originSender=' + originSender + '&data=' + data} state={{from: location}} replace={true}/>;
    }
    return <Navigate to="/start" state={{from: location}} replace={true}/>;
}
