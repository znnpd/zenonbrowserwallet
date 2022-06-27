import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {Card, CardHeader} from "@mui/material";
import {WalletHooks} from "../hooks/walletHooks";
import {Doughnut} from 'react-chartjs-2';
import {ArcElement, Chart} from 'chart.js'
import {Layout} from "../components/layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import {TransactionList} from "../components/transactions/transactions";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TransactionHooks} from "../hooks/transactionHooks";
import {AddressSelection} from "../components/address/addressSelection";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import {doughnutStyling, theme} from "../components/theme/dark/theme.dark";
import {ITransaction} from "../service/zenon.service.interfaces";
import {useSelector} from "react-redux";
import {IRootState} from "../redux/root.reducer";


Chart.register(ArcElement);

export const WalletPage = () => {

    const walletHook = WalletHooks();
    const transactionHook = TransactionHooks();

    const balance = () : any => {
        const {balanceInfoMap} = useSelector((state: IRootState) => state.walletState.accountInfo)
        const balances: number[] = [];
        const currencies: string[] = [];
        const colors: string[] = [];
        let index = 0;
        for (let key in balanceInfoMap) {
            const balanceEntry = balanceInfoMap[key];
            balances.push(balanceEntry.balance / Math.pow(10, balanceEntry.token.decimals));
            currencies.push(balanceEntry.token.symbol);
            switch (balanceEntry.token.symbol){
                case 'ZNN':
                    colors.push('#55b53f');
                    break;
                case 'QSR':
                    colors.push('#192fc9');
                    break;
                default:
                    const color = 0xccebff + index * 0x10000;
                    colors.push(`#${color}`);
                    break;
            }
            index++;
        }
        return {
            datasets: [
                {
                    data: balances,
                    backgroundColor: colors,
                    borderWidth: 8,
                    borderColor: theme.palette.background.default,
                    hoverBorderColor: theme.palette.background.default
                }
            ],
            labels: currencies
        };
    }

    // Navigate programmatically with in react-router-dom
    let navigate = useNavigate();  // Hook
    function navigateTo(path: string, queryParams: string) {
        if (queryParams) {
            navigate({pathname: path, search: queryParams});
        } else {
            navigate({pathname: path});
        }

    }

    // Read query params
    let [searchParams, setSearchParams] = useSearchParams();
    let params = Object.fromEntries([...searchParams]);
    delete params.navigateTo;
    const navigateToParam = searchParams.get("navigateTo");

    // This hook is used when loading the page, we automatically route if 'navigateTo' query param is set
    useEffect(() => {
        if (navigateToParam) {
            navigateTo("/" + navigateToParam, `?${createSearchParams(params)}`);
        }
    });

    const compareTransactions = function(a,b){
        return new Date(b.confirmationTimestampUTC).getTime() > new Date(a.confirmationTimestampUTC).getTime() ? 1 : -1;
    }

    const getLatestTransactions = () => {
        const transactions: ITransaction[] = useSelector((state: IRootState) => state.transactionState.transactions)
        if(transactions) {
            return transactions.sort(compareTransactions).slice(0, 5);
        }
        return [];
    };

    const balances = balance();
    return (
        <Layout title="Wallet">
            <Box>
                <AddressSelection />
                {balances.datasets[0].data.length > 0 &&
                    <Box
                        sx={{
                            height: 300,
                            position: 'relative',
                            marginBottom: 3
                        }}
                    >
                        <Doughnut
                            data={balances}
                            options={doughnutStyling}
                        />
                        <Grid container>
                            {balances.datasets[0].data.map((token, index) => (
                                <Grid key={index} sx={{ml: 2, mr: 2}}>
                                    <span>{token} {balances.labels[index]}</span>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                }

                <Grid container>
                    <Grid item sx={{ml: 6, mr: 4}}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={walletHook.sendTransactionModal}
                        >
                            send
                        </Button>
                    </Grid>
                    {/*<Grid item>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={walletHook.receiveTransactionModal}
                        >
                            receive
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={walletHook.fuseQSRModal}
                        >
                            fuse
                        </Button>
                    </Grid>*/}
                </Grid>

                <Card>
                    <CardHeader title="Latest Transactions"/>
                    <PerfectScrollbar>
                        <Box sx={{maxWidth: 300}}>
                            <TransactionList transactions={getLatestTransactions()}/>
                        </Box>
                    </PerfectScrollbar>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}
                    >
                        <Button
                            color="primary"
                            endIcon={<ArrowRightIcon fontSize="small"/>}
                            size="small"
                            variant="text"
                            onClick={transactionHook.allTransactions}
                        >
                            View all
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Layout>
    );
}
