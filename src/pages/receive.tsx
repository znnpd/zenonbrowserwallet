import * as React from "react";
import {Layout} from "../components/layout";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {QRCode} from "react-qrcode-logo";
import {Currency} from "../redux/transactions/transactions.reducer";
import {AddressSelection} from "../components/address/addressSelection";
import TextField from "@mui/material/TextField";
import {emptyTokenStandard, qsrTokenStandard, znnTokenStandard} from "../service/zenon.service";
import {useSelector} from "react-redux";
import {IRootState} from "../redux/root.reducer";
import "./receive.css";

export const ReceivePage = () => {

    const [amount, setAmount] = React.useState<string>('0');
    const [currency, setCurrency] = React.useState<Currency>(Currency.ZNN);
    const currentAddress = useSelector((state: IRootState) => state.walletState.currentAddress);

    const getQRCode = (): string => {
        let zts;
        switch (currency) {
            case Currency.ZNN:
                zts = znnTokenStandard;
                break;
            case Currency.QSR:
                zts = qsrTokenStandard;
                break;
            default:
                zts = emptyTokenStandard;
        }
        return `znn:${currentAddress}?zts=${zts}&amount=${amount}`;
    }

    return (
        <Layout title="Receive Transaction">
            <Box>
                <div className="qrcode">
                    <QRCode value={getQRCode()}
                        eyeRadius={5}/> {/*logoImage="https://zenon.network/img/favicon-32x32.png" logoHeight={32} logoWidth={32}*/}
                </div>
                <Box>
                    <AddressSelection/>
                    <ToggleButtonGroup
                        color="primary"
                        value={currency}
                        exclusive
                        fullWidth
                        onChange={(event, newCurrency) => setCurrency(newCurrency)}
                    >
                        {Object.keys(Currency).map(currency =>
                            (<ToggleButton value={currency} key={currency}>{currency}</ToggleButton>)
                        )}
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
                </Box>
            </Box>
        </Layout>
    )
}
