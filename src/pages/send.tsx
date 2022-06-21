import * as React from "react";
import {Layout} from "../components/layout";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {AddressSelection} from "../components/address/addressSelection";
import {Currency} from "../redux/transactions/transactions.reducer";
import {TransactionHooks} from "../hooks/transactionHooks";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../redux/root.reducer";
import {useLocation} from "react-router-dom";
import {setErrorMessageAction} from "../redux/common/common.actions";
import { znnTokenStandard, qsrTokenStandard } from "../service/zenon.service";

const queryString = require('query-string');

export const SendPage = () => {

    const dispatch = useDispatch();
    const transactionHook = TransactionHooks();
    const fromAddress = useSelector((state: IRootState) => state.walletState.currentAddress);
    const accountInfo = useSelector((state: IRootState) => state.walletState.accountInfo);
    const [currency, setCurrency] = React.useState<Currency>();
    const [toAddress, setToAddress] = React.useState<string>('');
    const [amount, setAmount] = React.useState<string>('0');
    const [password, setPassword] = React.useState<string>('');


    // Check if navigation params exist in url (if opened from a website)
    const location = useLocation();
    const params = queryString.parse(location.search);
    if (params.data) {
        var originSender = params.originSender;
        var tabIdSender = params.tabIdSender;
        var navigateTo = params.navigateTo;
        var data = JSON.parse(params.data);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(fromAddress && toAddress && currency && amount && password) {
            transactionHook.sendTransaction({fromAddress, toAddress, currency, amount: parseFloat(amount), password});
        } else {
            dispatch(setErrorMessageAction(new Error('Fill-in all mandatory elements')))
        }
    };

    const getCurrenciesOfAddress = (): {name: string, tokenStandard: string}[] => {
        const currencies: {name: string, tokenStandard: string}[] = [];
        for (let key in accountInfo.balanceInfoMap) {
            const balanceEntry = accountInfo.balanceInfoMap[key];
            currencies.push({name: balanceEntry.token.symbol, tokenStandard: balanceEntry.token.tokenStandard});
        }
        if (currencies.length === 0) {
            currencies.push({name: "ZNN", tokenStandard: znnTokenStandard.toString()});
            currencies.push({name: "QSR", tokenStandard: qsrTokenStandard.toString()}); // Support at least ZNN and QSR to display toggle button
        }
        return currencies;
    }

    React.useEffect(() => {
        if (data) {
            setToAddress(data.toAddress);
            setCurrency(data.currency);
            setAmount(data.amount);
        }
    }, []);

    return (
        <Layout title="Send Transaction">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                <AddressSelection />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="toAddress"
                    label="to address"
                    id="toAddress"
                    value={toAddress}
                    onChange={e => setToAddress(e.target.value)}
                />
                <ToggleButtonGroup
                    color="primary"
                    value={currency}
                    exclusive
                    onChange={(event, newCurrency) => setCurrency(newCurrency)}
                >
                    {   getCurrenciesOfAddress().map(currency =>
                            (<ToggleButton value={currency.tokenStandard} key={currency.name}>{currency.name}</ToggleButton>)
                        )
                    }
                </ToggleButtonGroup>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="amount"
                    label="amount"
                    id="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Send Transaction
                </Button>
            </Box>
        </Layout>
    )
}
