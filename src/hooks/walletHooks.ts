import {useDispatch, useSelector} from 'react-redux'
import type {AppDispatch} from '../redux/store'
import {IRootState} from "../redux/root.reducer";
import {useCallback} from "react";
import {IAccountInfo, IWallet} from "../service/zenon.service.interfaces";
import {
    changeWalletAddressAction,
    manualLockAction,
    refreshWalletAddressAction,
    setWalletAction,
    showFuseQSRAction,
    showReceiveTransactionAction,
    showSendTransactionAction
} from "../redux/wallet/wallet.actions";
import {hideModalAction} from "../redux/common/common.actions";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export interface IWalletHooks {
    closeModal: () => void;
    changeAddress: (address: string) => void;
    fuseQSRModal: () => void;
    receiveTransactionModal: () => void;
    sendTransactionModal: () => void;
    getWallet: () => IWallet;
    setWallet: (wallet: IWallet) => void;
    getAccountInfo: () => IAccountInfo;
    isModalOpen: () => boolean;
    getAddresses: () => string[];
    refreshWalletAddressData: () => void;
    lockWallet: () => void;
}

export const WalletHooks = (): IWalletHooks => {
    const dispatch = useDispatch();

    const wallet: IWallet = useSelector((state: IRootState) => state.walletState.wallet)

    const accountInfo = useSelector((state: IRootState) => state.walletState.accountInfo)

    const currentAddress: string = useSelector((state: IRootState) => state.walletState.currentAddress)

    const getWallet = useCallback(() => {
        return wallet
    }, [wallet])

    const getAccountInfo = useCallback(() => {
        return accountInfo
    }, [accountInfo])

    const setWallet = useCallback((wallet: IWallet) => {
        dispatch(setWalletAction(wallet))
    }, [dispatch])

    const refreshWalletAddressData = useCallback(() => {
        dispatch(refreshWalletAddressAction(currentAddress))
    }, [dispatch, currentAddress])

    const getAddresses = useCallback((): string[] => {
        if(wallet.baseAddress) {
            return [wallet.baseAddress] //TODO where are the other addresses?
        }
        return []
    }, [wallet])

    const modal: boolean = useSelector((state: IRootState) => state.commonState.modal)

    const isModalOpen = useCallback(() => {
        return modal
    }, [modal])

    const closeModal = useCallback(() => {
        dispatch(hideModalAction())
    }, [dispatch])

    const changeAddress = useCallback((address: string) => {
        dispatch(changeWalletAddressAction(address))
    }, [dispatch])

    const sendTransactionModal = useCallback(() => {
        dispatch(showSendTransactionAction())
    }, [dispatch])

    const receiveTransactionModal = useCallback(() => {
        dispatch(showReceiveTransactionAction())
    }, [dispatch])

    const fuseQSRModal = useCallback(() => {
        dispatch(showFuseQSRAction())
    }, [dispatch])

    const lockWallet = useCallback(() => {
        dispatch(manualLockAction())
    }, [dispatch])

    return {
        getWallet,
        setWallet,
        getAccountInfo,
        fuseQSRModal,
        receiveTransactionModal,
        sendTransactionModal,
        changeAddress,
        isModalOpen,
        closeModal,
        getAddresses,
        refreshWalletAddressData,
        lockWallet
    }
}
