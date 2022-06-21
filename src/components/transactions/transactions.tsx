import * as React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Currency} from "../../redux/transactions/transactions.reducer";
import {CurrencyPill} from "../currency-pill";
import {ITransaction} from "../../service/zenon.service.interfaces";
import {makeStyles} from "@mui/styles";

const formatTimestampDate = (isoDateString: string): string => {
    const timestamp = new Date(isoDateString);
    return `${timestamp.getDate()}.${timestamp.getMonth() + 1}.${timestamp.getFullYear()}`;
}

const formatTimestampTime = (isoDateString: string): string => {
    const timestamp = new Date(isoDateString);
    return `${addLeadingZero(timestamp.getHours())}:${addLeadingZero(timestamp.getMinutes())}:${addLeadingZero(timestamp.getSeconds())}`;
}

const addLeadingZero = (nrToFormat: number): string => {
    if(nrToFormat == 0){
        return '00';
    }else if(nrToFormat < 10){
        return `0${nrToFormat}`;
    }
    return `${nrToFormat}`;
}

const useStyles = makeStyles((theme) => ({
    row: {
        cursor: "pointer",
    },
    hover: {
        "&:hover": {
            backgroundColor: "green !important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
}));

export const TransactionList = ({transactions}: { transactions: ITransaction[]}) => {
    const classes = useStyles();
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Transaction Date
                    </TableCell>
                    <TableCell>
                        Amount
                    </TableCell>
                    <TableCell sortDirection="desc">
                        Token
                    </TableCell>
                    <TableCell>
                        Direction
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {transactions.map((transaction, index) => {
                    return (
                    <TableRow
                        hover
                        key={index}
                        className={classes.hover}
                    >
                        <TableCell>
                            {formatTimestampDate(transaction.confirmationTimestampUTC)}<br/>
                            {formatTimestampTime(transaction.confirmationTimestampUTC)}
                        </TableCell>
                        <TableCell>
                            {transaction.amount.toFixed(16).replace(/\.?0+$/,"")}
                        </TableCell>
                        <TableCell>
                            <CurrencyPill
                                color={(transaction.token === Currency.ZNN && 'primary')
                                    || (transaction.token === Currency.QSR && 'secondary')
                                    || 'info'}
                            >
                                {transaction.token}
                            </CurrencyPill>
                        </TableCell>
                        <TableCell sx={{maxWidth: 50}}>
                            {transaction.direction}
                        </TableCell>
                    </TableRow>
                )}
                )}
            </TableBody>
        </Table>
    )
}
