import {createAction} from 'redux-actions';
import {nameActions} from "../root.action";

const walletAction = nameActions('ZNN')('WALLET');

export const unlockWalletAction = createAction(walletAction('UNLOCK'));
export const lockWalletAction = createAction(walletAction('LOCK'));
export const deleteWalletAction = createAction(walletAction('DELETE'));
export const storeWalletAction = createAction(walletAction('STORE'));
export const showImportExistingWalletAction = createAction(walletAction('SHOW_IMPORT'));
export const showCreateWalletAction = createAction(walletAction('SHOW_CREATE'));
export const importExistingWalletAction = createAction(walletAction('IMPORT'));
export const createWalletAction = createAction(walletAction('CREATE'));
export const refreshWalletAddressAction = createAction(walletAction('REFRESH_ADDRESS'));
export const checkActivityAction = createAction(walletAction('ACTIVITY_CHECK'));
export const manualLockAction = createAction(walletAction('MANUAL_LOCK'));

export const showFuseQSRAction = createAction(walletAction('SHOW_FUSE_QSR'));
export const fuseQSRAction = createAction(walletAction('FUSE_QSR'));

export const showReceiveTransactionAction = createAction(walletAction('SHOW_RECEIVE_TRANSACTION'));
export const receiveTransactionAction = createAction(walletAction('RECEIVE_TRANSACTION'));

export const showSendTransactionAction = createAction(walletAction('SEND_TRANSACTION'));

export const changeWalletAddressAction = createAction(walletAction('CHANGE_ADDRESS'));
export const addWalletAddressAction = createAction(walletAction('ADD_ADDRESS'));
export const storeWalletAddressAction = createAction(walletAction('STORE_ADDRESS'));
export const setWalletAction = createAction(walletAction('SET'))

export const loadAccountInfoAction = createAction(walletAction('LOAD_ACCOUNT_INFO'))
export const storeAccountInfoAction = createAction(walletAction('STORE_ACCOUNT_INFO'))
