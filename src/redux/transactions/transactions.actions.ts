import {createAction} from 'redux-actions';
import {nameActions} from "../root.action";

const transactionAction = nameActions('ZNN')('TRANSACTION');

export const showTransactionsAction = createAction(transactionAction('SHOW'));
export const loadTransactionsAction = createAction(transactionAction('LOAD'));
export const storeTransactionsAction = createAction(transactionAction('STORE'));
export const sendNewTransactionAction = createAction(transactionAction('SEND'));
