import {useDispatch, useSelector} from 'react-redux'
import type {AppDispatch} from '../redux/store'
import {IRootState} from "../redux/root.reducer";
import {useCallback} from "react";
import {INewTransaction} from "../redux/transactions/transactions.reducer";
import {sendNewTransactionAction, showTransactionsAction} from "../redux/transactions/transactions.actions";
import {ITransaction} from "../service/zenon.service.interfaces";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export interface ITransactionHooks {
    allTransactions: () => void;
    getAllTransactions: () => ITransaction[];
    sendTransaction: (newTransaction: INewTransaction) => void;
}

export const TransactionHooks = (): ITransactionHooks => {
    const dispatch = useDispatch();

    const transactions: ITransaction[] = useSelector((state: IRootState) => state.transactionState.transactions)

    const getAllTransactions = useCallback(() => {
        if(transactions) {
            return transactions.sort(compareTransactions);
        }
        return [];
    }, [transactions])

    const compareTransactions = function(a,b){
        return new Date(b.confirmationTimestampUTC).getTime() > new Date(a.confirmationTimestampUTC).getTime() ? 1 : -1;
    }

    const allTransactions = useCallback(() => {
        dispatch(showTransactionsAction())
    }, [dispatch])

    const sendTransaction = useCallback((newTransaction: INewTransaction) => {
        dispatch(sendNewTransactionAction(newTransaction))
    }, [dispatch])

    return {
        allTransactions,
        getAllTransactions,
        sendTransaction
    }
}
