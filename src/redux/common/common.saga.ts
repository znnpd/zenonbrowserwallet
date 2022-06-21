import {put, takeEvery} from "redux-saga/effects";
import {showCreateWalletAction, showImportExistingWalletAction} from "../wallet/wallet.actions";
import {IAction} from "../root.saga";
import {hideSpinnerAction, setErrorMessageAction, showSpinnerAction} from "./common.actions";
import {push} from "redux-first-history";

export function* showImportExistingWalletSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/import'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* showCreateWalletSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/create'));
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export const commonSagas = [
    takeEvery(showImportExistingWalletAction, showImportExistingWalletSaga),
    takeEvery(showCreateWalletAction, showCreateWalletSaga),
];
