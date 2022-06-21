import {handleActions} from 'redux-actions';
import {IAction} from "../root.reducer";
import {
    clearErrorMessageAction,
    hideModalAction,
    hideSidebarAction,
    hideSpinnerAction,
    setErrorMessageAction,
    showModalAction,
    showSidebarAction,
    showSpinnerAction
} from "./common.actions";

export interface ICommonState {
    error?: Error;
    spinner: boolean;
    modal: boolean;
    sidebar: boolean;
    lastAction: Date;
}

const commonDefaultState: ICommonState = {
    error: undefined,
    spinner: false,
    modal: false,
    sidebar: false,
    lastAction: new Date()
};

const commonReducer = handleActions<ICommonState, any>(
    {
        [setErrorMessageAction]: (state: ICommonState, {payload}: IAction<Error>) =>
            ({
                ...state,
                error: payload
            }),
        [clearErrorMessageAction]: (state: ICommonState) =>
            ({
                ...state,
                error: null
            }),
        [showSpinnerAction]: (state: ICommonState) =>
            ({
                ...state,
                spinner: true,
                lastAction: new Date()
            }),
        [hideSpinnerAction]: (state: ICommonState) =>
            ({
                ...state,
                spinner: false
            }),
        [showModalAction]: (state: ICommonState) =>
            ({
                ...state,
                modal: true
            }),
        [hideModalAction]: (state: ICommonState) =>
            ({
                ...state,
                modal: false
            }),
        [showSidebarAction]: (state: ICommonState) =>
            ({
                ...state,
                sidebar: true
            }),
        [hideSidebarAction]: (state: ICommonState) =>
            ({
                ...state,
                sidebar: false
            }),
    },
    commonDefaultState,
);

export default commonReducer;
