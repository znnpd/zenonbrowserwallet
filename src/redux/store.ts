import {applyMiddleware, createStore} from 'redux';
import reducers from "./root.reducer";
import {composeWithDevTools} from "redux-devtools-extension";
import createSagaMiddleware from 'redux-saga';
import rootSaga from './root.saga';
import {createBrowserHistory} from 'history';
import {createReduxHistoryContext} from "redux-first-history";

const {createReduxHistory, routerMiddleware, routerReducer} = createReduxHistoryContext({
    history: createBrowserHistory(),
    //other options if needed
});

const middleware: any[] = [];

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
middleware.push(sagaMiddleware);

const isPromise = value => value !== null && typeof value === 'object' && typeof value.then === 'function';

// global error middleware
middleware.push(() => next => action => {

    // If not a promise, continue on
    if (!isPromise(action.payload)) {
        return next(action);
    }
    // Dispatch initial pending promise, but catch any errors
    return next(action).catch(error => {
        console.log(`${action.type} unhandled rejection caught at middleware with reason: ${JSON.stringify(error.message)}.`);
        return error;
    });
});

//history middleware
middleware.push(routerMiddleware);

const createReduxStore = () => {
    const reduxStore = createStore(
        reducers(routerReducer),
        composeWithDevTools(applyMiddleware(...middleware))
    );

    sagaMiddleware.run(rootSaga);

    return reduxStore;
}
export const store = createReduxStore();

export const history = createReduxHistory(store);

export type AppDispatch = typeof store.dispatch
