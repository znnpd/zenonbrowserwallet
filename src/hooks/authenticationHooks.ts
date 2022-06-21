import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppDispatch} from '../redux/store'
import {IRootState} from "../redux/root.reducer";
import {useCallback} from "react";
import {
    createWalletAction,
    deleteWalletAction,
    importExistingWalletAction,
    showCreateWalletAction,
    showImportExistingWalletAction,
    unlockWalletAction
} from "../redux/wallet/wallet.actions";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector

export interface IAppAuthentication {
    doSignIn: (password: string, navigateTo: string | null, tabIdSender: string | null, originSender: string | null, data: string | null) => void;
    doDeleteWallet: () => void;
    doImportExistingWallet: (mnemonic: string, password: string) => void;
    doCreateWallet: (password: string) => void;
    isUnlocked: () => boolean;
    showImportExistingWallet: () => void;
    showCreateWallet: () => void;
}

export const AppAuthentication = (): IAppAuthentication => {
    const dispatch = useDispatch();

    const unlocked: boolean = useSelector((state: IRootState) => state.walletState.unlocked)

    const isUnlocked = useCallback(() => {
        return unlocked
    }, [unlocked])

    const doSignIn = useCallback((password, navigateTo, tabIdSender, originSender, data) => {
        dispatch(unlockWalletAction({password: password, navigateTo: navigateTo, tabIdSender: tabIdSender, originSender: originSender, data: data}))
    }, [dispatch])

    const doDeleteWallet = useCallback(() => {
        dispatch(deleteWalletAction())
    }, [dispatch])

    const doImportExistingWallet = useCallback((mnemonic, password) => {
        dispatch(importExistingWalletAction({mnemonic, password}))
    }, [dispatch])

    const doCreateWallet = useCallback((password) => {
        dispatch(createWalletAction(password))
    }, [dispatch])

    const showImportExistingWallet = useCallback(() => {
        dispatch(showImportExistingWalletAction())
    }, [dispatch])

    const showCreateWallet = useCallback(() => {
        dispatch(showCreateWalletAction())
    }, [dispatch])

    return {
        doSignIn,
        doDeleteWallet: doDeleteWallet,
        doImportExistingWallet,
        doCreateWallet,
        isUnlocked,
        showImportExistingWallet,
        showCreateWallet
    }
}
