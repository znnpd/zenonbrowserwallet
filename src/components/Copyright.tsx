import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";

export const Copyright = (props: any) => {
    return (
        <Typography variant="body2" color="text.primary" align="center" {...props}>
            {'Copyright © '}
            <Link color="text.primary" href="https://zenon-wallet.org/">
                Zenon Wallet
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
