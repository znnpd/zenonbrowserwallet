import {useDispatch, useSelector} from 'react-redux'
import type {AppDispatch} from '../redux/store'
import {IRootState} from "../redux/root.reducer";
import {useCallback} from "react";
import {hideSidebarAction, showSidebarAction} from "../redux/common/common.actions";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export interface ICommonHooks {
    openSidebar: () => void;
    closeSidebar: () => void;
    isSidebarOpen: () => boolean;
}

export const CommonHooks = (): ICommonHooks => {
    const dispatch = useDispatch();

    const openSidebar = useCallback(() => {
        dispatch(showSidebarAction())
    }, [dispatch])

    const closeSidebar = useCallback(() => {
        dispatch(hideSidebarAction())
    }, [dispatch])

    const isSidebarOpen = useCallback(() => {
        return useSelector((state: IRootState) => state.commonState.sidebar);
    }, [useSelector])

    return {
        openSidebar,
        closeSidebar,
        isSidebarOpen
    }
}
