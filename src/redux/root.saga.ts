import {all} from '@redux-saga/core/effects';
import {walletSagas} from "./wallet/wallet.saga";
import {transactionsSagas} from "./transactions/transactions.saga";
import {commonSagas} from "./common/common.saga";

export interface IAction<T> {
    type: string,
    payload: T
}

/**
 * the root saga
 */
export default function* rootSaga() {
    yield all([
        ...walletSagas,
        ...transactionsSagas,
        ...commonSagas
    ]);
}
