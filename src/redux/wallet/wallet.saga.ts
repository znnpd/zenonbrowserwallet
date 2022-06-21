import {call, put, select, takeEvery} from 'redux-saga/effects'
import {IRootState} from "../root.reducer";
import {IAction} from "../root.saga";
import {push} from "redux-first-history";
import {hideSpinnerAction, setErrorMessageAction, showSpinnerAction} from "../common/common.actions";
import {
    addWalletAddressAction,
    changeWalletAddressAction,
    checkActivityAction,
    createWalletAction,
    deleteWalletAction,
    importExistingWalletAction,
    loadAccountInfoAction,
    lockWalletAction,
    manualLockAction,
    refreshWalletAddressAction,
    setWalletAction,
    showFuseQSRAction,
    showReceiveTransactionAction,
    showSendTransactionAction,
    storeAccountInfoAction,
    storeWalletAction,
    storeWalletAddressAction,
    unlockWalletAction
} from "./wallet.actions";
import {ZenonService} from "../../service/zenon.service";
import {loadTransactionsAction} from "../transactions/transactions.actions";
import {IWallet} from "../../service/zenon.service.interfaces";
import {password, setPassword} from "../../App";

const zenonService = new ZenonService();

export function* unlockWalletSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        setPassword(action.payload['password']);
        let wallet = yield call(zenonService.decryptWallet, action.payload['password']);
        yield put(storeWalletAction(wallet));
        yield put(refreshWalletAddressAction(wallet.baseAddress));
        //navigate to destination page (note that navigateTo might a string when transported as query string!)
        if (action.payload['navigateTo'] && action.payload['navigateTo'] != 'undefined') {
            yield put(push(action.payload['navigateTo'] + "?tabIdSender=" + action.payload['tabIdSender'] + "&originSender=" + action.payload['originSender'] + "&data=" + action.payload['data']));
        } else {
            yield put(push('/'));
        }
    } catch (e: any) {
        yield put(setErrorMessageAction(new Error('Failed to unlock wallet.')));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* createWalletSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        let wallet = yield call(zenonService.createNewWallet, action.payload);
        let walletString = JSON.stringify(wallet);
        localStorage.setItem('wallet', walletString);
        yield put(storeWalletAction(wallet));
        yield put(refreshWalletAddressAction(wallet.baseAddress));
        //navigate to wallet page
        yield put(push('/'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* importExistingWalletSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        const {mnemonic, password} = action.payload;
        let wallet = yield call(zenonService.importExistingWallet, mnemonic, password);
        let walletString = JSON.stringify(wallet);
        localStorage.setItem('wallet', walletString);
        yield put(storeWalletAction(wallet));
        yield put(refreshWalletAddressAction(wallet.baseAddress));
        //navigate to wallet page
        yield put(push('/'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* showSendTransactionSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/send'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* showReceiveTransactionSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/receive'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* showFuseQSRSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/fuse'));
        //TODO add logic
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* setWalletActionSaga(action: IAction<IWallet>) {
    yield put(showSpinnerAction());
    try {
        yield put(refreshWalletAddressAction(action.payload.baseAddress));
    } catch (e: any) {
        yield put(setErrorMessageAction(e));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* refreshWalletAddressSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        yield put(loadTransactionsAction(action.payload));
        yield put(loadAccountInfoAction(action.payload))
    } catch (e: any) {
        yield put(setErrorMessageAction(e));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* loadAccountInfoSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        let accountInfo = yield call(zenonService.getAccountInfo, action.payload);
        yield put(storeAccountInfoAction(accountInfo))
    } catch (e: any) {
        yield put(setErrorMessageAction(e));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* deleteWalletSaga() {
    yield put(showSpinnerAction());
    try {
        yield call(zenonService.deleteWallet);
        yield put(storeWalletAction(null));
        //navigate to wallet page
        yield put(push('/'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* addWalletAddressSaga(action: IAction<number>) {
    yield put(showSpinnerAction());
    try {
        let newAddress = yield call(zenonService.deriveAddress, action.payload, password);
        newAddress = newAddress ? newAddress.toString() : null;
        yield put(storeWalletAddressAction(newAddress));
        yield put(loadTransactionsAction(newAddress));
        yield put(loadAccountInfoAction(newAddress));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* changeWalletAddressSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        yield put(loadTransactionsAction(action.payload));
        yield put(loadAccountInfoAction(action.payload));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

const MINUTES_15 = 15 * 60 * 1000;

export function* checkActivitySaga() {
    const unlocked = yield select((state: IRootState) => state.walletState.unlocked);
    if(unlocked) {
        const lastAction: Date = yield select((state: IRootState) => state.commonState.lastAction);
        if (lastAction.getTime() + MINUTES_15 < new Date().getTime()) {
            setPassword('');
            manualLockSaga();
        } else {
            const currentAddress = yield select((state: IRootState) => state.walletState.currentAddress);
            if (currentAddress && password) {
                yield call(zenonService.receiveAllTransactions, currentAddress, password)
            }
        }
    }
}

export function* manualLockSaga() {
    yield put(push('/login'));
    yield put(lockWalletAction());
}

export const walletSagas = [
    takeEvery(unlockWalletAction, unlockWalletSaga),
    takeEvery(importExistingWalletAction, importExistingWalletSaga),
    takeEvery(createWalletAction, createWalletSaga),
    takeEvery(showSendTransactionAction, showSendTransactionSaga),
    takeEvery(showReceiveTransactionAction, showReceiveTransactionSaga),
    takeEvery(showFuseQSRAction, showFuseQSRSaga),
    takeEvery(deleteWalletAction, deleteWalletSaga),
    takeEvery(setWalletAction, setWalletActionSaga),
    takeEvery(loadAccountInfoAction, loadAccountInfoSaga),
    takeEvery(refreshWalletAddressAction, refreshWalletAddressSaga),
    takeEvery(checkActivityAction, checkActivitySaga),
    takeEvery(manualLockAction, manualLockSaga),
    takeEvery(addWalletAddressAction, addWalletAddressSaga),
    takeEvery(changeWalletAddressAction, changeWalletAddressSaga),
];
