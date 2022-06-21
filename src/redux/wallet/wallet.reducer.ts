import {handleActions} from 'redux-actions';
import {
    changeWalletAddressAction,
    lockWalletAction,
    setWalletAction,
    storeAccountInfoAction,
    storeWalletAction,
    storeWalletAddressAction
} from "./wallet.actions";
import {IAccountInfo, IAddress, IBalanceInfo, IWallet} from "../../service/zenon.service.interfaces";
import {IAction} from "../root.reducer";

export interface IWalletState {
    wallet: IWallet,
    currentAddress: string;
    unlocked: boolean;
    accountInfo: IAccountInfo;
    addresses: string[];
}

const defaultState: IWalletState = {wallet: {}, currentAddress: '', addresses: [], unlocked: false, accountInfo: {address: '', accountHeight: 0, balanceInfoMap: new Map<string, IBalanceInfo>()}};

const walletReducer = handleActions(
    {
        [storeWalletAction]: (
            state: IWalletState,
            action: IAction<IWallet>
        ) => {
            return {...state, wallet: action.payload, currentAddress: action.payload?.baseAddress, addresses: [action.payload?.baseAddress], unlocked: true};
        },
        [lockWalletAction]: (
            state: IWalletState,
        ) => {
            return {...state, unlocked: false};
        },
        [setWalletAction]: (
            state: IWalletState,
            action: IAction<IWallet>
        ) => {
            return {...state, wallet: action.payload, unlocked: true, currentAddress: action.payload?.baseAddress, addresses: [action.payload?.baseAddress]};
        },
        [storeAccountInfoAction]: (
            state: IWalletState,
            action: IAction<IAccountInfo>
        ) => {
            return {...state, accountInfo: action.payload};
        },
        [changeWalletAddressAction]: (
            state: IWalletState,
            action: IAction<string>
        ) => {
            return {...state, currentAddress: action.payload};
        },
        [storeWalletAddressAction]: (
            state: IWalletState,
            action: IAction<IAddress>
        ) => {
            return {...state, currentAddress: action.payload, addresses: [...state.addresses, action.payload]};
        }
    },
    defaultState
);

export default walletReducer;
