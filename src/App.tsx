import * as React from "react";
import {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import {DashboardLayout} from "./components/dashboard/dashboard-layout";
import {LogIn} from "./pages/login";
import {ImportPage} from "./pages/import";
import {CreatePage} from "./pages/create";
import {SendPage} from "./pages/send";
import {ReceivePage} from "./pages/receive";
import {TransactionsPage} from "./pages/transactions";
import {WalletPage} from "./pages/wallet";
import {WalletChecker} from "./components/auth-provider/wallet-checker";
import {Start} from "./pages/start";
import {SiteApproval} from "./pages/siteapproval";
import {Alert, CircularProgress, Grid, Modal, Slide, Snackbar, ThemeProvider} from "@mui/material";
import {theme} from "./components/theme/dark/theme.dark";
import {useDispatch, useSelector} from "react-redux";
import {checkActivityAction} from "./redux/wallet/wallet.actions";
import {IRootState} from "./redux/root.reducer";
import {clearErrorMessageAction} from "./redux/common/common.actions";

export let password = '';

export const setPassword = (p: string) => {
    password = p;
}

export default function App() {

    const dispatch = useDispatch();
    const globalError = useSelector((state: IRootState) => state.commonState.error);
    const showSpinner = useSelector((state: IRootState) => state.commonState.spinner);
    const [openErrorMessage, setOpenErrorMessage] = React.useState(false);
    const [lastErrorMessage, setLastErrorMessage] = React.useState('');
    //const [alert, setAlert] = React.useState<boolean | string>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            dispatch(checkActivityAction());
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (globalError) {
            setOpenErrorMessage(true);
            setLastErrorMessage(globalError.message);
            dispatch(clearErrorMessageAction());
        }
    }, [globalError]);

    const SlideTransitionLeft = (props) => {
        return <Slide {...props} direction="left" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route element={<DashboardLayout/>}>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/start" element={<Start/>}/>
                    <Route path="/import" element={<ImportPage/>}/>
                    <Route path="/create" element={<CreatePage/>}/>
                    <Route
                        path="/siteapproval"
                        element={
                            <WalletChecker>
                                <SiteApproval/>
                            </WalletChecker>
                        }
                    />
                    <Route
                        path="/index.html"
                        element={
                           <WalletChecker>
                                <WalletPage/>
                           </WalletChecker>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <WalletChecker>
                                <WalletPage/>
                            </WalletChecker>
                        }
                    />
                    <Route
                        path="/send"
                        element={
                            <WalletChecker>
                                <SendPage/>
                            </WalletChecker>
                        }
                    />
                    {/*<Route
                        path="/receive"
                        element={
                            <WalletChecker>
                                <ReceivePage/>
                            </WalletChecker>
                        }
                    />*/}
                    {/*<Route
                        path="/fuse"
                        element={
                            <WalletChecker>
                                <FusePage/>
                            </WalletChecker>
                        }
                    />*/}
                    <Route
                        path="/transactions"
                        element={
                            <WalletChecker>
                                <TransactionsPage/>
                            </WalletChecker>
                        }
                    />
                </Route>
            </Routes>
            <Modal open={showSpinner}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xs={3}>
                        <CircularProgress color="primary" />
                    </Grid>
                </Grid>
            </Modal>
            <Snackbar
                open={openErrorMessage}
                autoHideDuration={5000}
                TransitionComponent={SlideTransitionLeft}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => {setOpenErrorMessage(false)}} severity="error">{lastErrorMessage}</Alert>
            </Snackbar>
        </ThemeProvider>
    );
}