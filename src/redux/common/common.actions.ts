import {createAction} from 'redux-actions';
import {nameActions} from "../root.action";

/** error/info message actions */
const globalMessageActions: any = nameActions('ZNN')('ERROR_MESSAGE');
export const setErrorMessageAction: any = createAction(globalMessageActions('SET'));
export const clearErrorMessageAction: any = createAction(globalMessageActions('CLEAR'));

const spinnerActions: any = nameActions('ZNN')('SPINNER');
export const showSpinnerAction: any = createAction(spinnerActions('SHOW'));
export const hideSpinnerAction: any = createAction(spinnerActions('HIDE'));

const modalActions: any = nameActions('ZNN')('MODAL');
export const showModalAction: any = createAction(modalActions('SHOW'));
export const hideModalAction: any = createAction(modalActions('HIDE'));

const sidebarActions: any = nameActions('ZNN')('SIDEBAR');
export const showSidebarAction: any = createAction(sidebarActions('SHOW'));
export const hideSidebarAction: any = createAction(sidebarActions('HIDE'));
