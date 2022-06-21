import {call, put, takeEvery} from "redux-saga/effects";
import {
    loadTransactionsAction,
    sendNewTransactionAction,
    showTransactionsAction,
    storeTransactionsAction
} from "./transactions.actions";
import {IAction} from "../root.saga";
import {hideSpinnerAction, setErrorMessageAction, showSpinnerAction} from "../common/common.actions";
import {push} from "redux-first-history";
import {ZenonService} from "../../service/zenon.service";
import {INewTransaction} from "./transactions.reducer";
import {IRootState} from "../root.reducer";
import { ITransaction } from "../../service/zenon.service.interfaces";

const zenonService = new ZenonService();

export function* showTranscationsSaga(action: IAction<any>) {
    yield put(showSpinnerAction());
    try {
        yield put(push('/transactions'));
        const currentAddress = (state: IRootState) => state.walletState.currentAddress;
        yield put(loadTransactionsAction(currentAddress))
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* sendNewTransactionSaga(action: IAction<INewTransaction>) {
    yield put(showSpinnerAction());
    try {
        yield call(zenonService.sendTransaction, action.payload.fromAddress, action.payload.toAddress, action.payload.amount, action.payload.currency, action.payload.password);
    } catch (e: any) {
        yield put(setErrorMessageAction(e));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export function* loadTransactionsSaga(action: IAction<string>) {
    yield put(showSpinnerAction());
    try {
        let transactions: ITransaction[] = yield call(zenonService.getLatestTransactions, action.payload, 0, 10);
        yield put(storeTransactionsAction(transactions))
    } catch (e: any) {
        yield put(setErrorMessageAction(e.error));
    } finally {
        yield put(hideSpinnerAction());
    }
}

export const transactionsSagas = [
    takeEvery(showTransactionsAction, showTranscationsSaga),
    takeEvery(sendNewTransactionAction, sendNewTransactionSaga),
    takeEvery(loadTransactionsAction, loadTransactionsSaga),
];
