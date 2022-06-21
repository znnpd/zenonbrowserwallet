import {combineReducers} from "redux";
import {RouterState} from "redux-first-history";
import walletReducer, {IWalletState} from "./wallet/wallet.reducer";
import transactionsReducer, {ITransactionsState} from "./transactions/transactions.reducer";
import commonReducer, {ICommonState} from "./common/common.reducer";

export interface IRootState {
    router: RouterState,
    commonState: ICommonState,
    walletState: IWalletState,
    transactionState: ITransactionsState
}

export interface IAction<T> {
    type: string;
    payload?: T;
}

const rootReducer = (routerReducer) => combineReducers<IRootState>({
    router: routerReducer,
    commonState: commonReducer,
    walletState: walletReducer,
    transactionState: transactionsReducer
})

export default rootReducer;
