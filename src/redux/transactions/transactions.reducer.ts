import {handleActions} from 'redux-actions';
import {storeTransactionsAction} from "./transactions.actions";
import {IAction} from "../root.reducer";
import {ITransaction} from "../../service/zenon.service.interfaces";

export enum Currency {
    ZNN = "ZNN", QSR = "QSR"
}

export interface INewTransaction {
    amount: number,
    currency: Currency,
    fromAddress: string,
    toAddress: string,
    password: string
}

export interface ITransactionsState {
    transactions: ITransaction[]
}

const defaultState: ITransactionsState = {transactions: []};

const transactionsReducer = handleActions(
    {
        [storeTransactionsAction]: (
            state,
            action: IAction<ITransaction>
        ) => {
            return {...state, transactions: action.payload};
        }
    },
    defaultState
);

export default transactionsReducer;
