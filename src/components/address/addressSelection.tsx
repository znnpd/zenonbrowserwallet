import {MenuItem, Select} from "@mui/material";
import * as React from "react";
import {addWalletAddressAction, changeWalletAddressAction} from "../../redux/wallet/wallet.actions";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../redux/root.reducer";

export const AddressSelection = () => {

    const dispatch = useDispatch();

    const currentAddress = useSelector((state: IRootState) => state.walletState.currentAddress);
    const addresses = useSelector((state: IRootState) => state.walletState.addresses);

    const handleAddressChange = (e) => {
        e.preventDefault();
        if(e.target.value == 0){
            dispatch(addWalletAddressAction(addresses.length))
        } else {
            dispatch(changeWalletAddressAction(e.target.value))
        }
    }

    return (
        <Select
            labelId="wallet-address"
            id="wallet-address-selection"
            value={currentAddress}
            label="Address"
            sx={{mt: 3, mb: 2}}
            onChange={handleAddressChange}
        >
            {addresses.map((address, i) => (
                <MenuItem value={address} key={address}>{address}</MenuItem>
            ))}
            <MenuItem value={0} key={0}>Add Address</MenuItem>
        </Select>
    )
}
