import * as React from "react";
import {Layout} from "../components/layout";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Box, Card} from "@mui/material";
import {TransactionList} from "../components/transactions/transactions";
import {TransactionHooks} from "../hooks/transactionHooks";

export const TransactionsPage = (props) => {
    const transactionHook = TransactionHooks();

    return (
        <Layout title="All Transactions">
            <Card {...props}>
                <PerfectScrollbar>
                    <Box sx={{minWidth: 400}}>
                        <TransactionList transactions={transactionHook.getAllTransactions()}/>
                    </Box>
                </PerfectScrollbar>
            </Card>
        </Layout>
    )
}
