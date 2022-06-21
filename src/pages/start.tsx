import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {AppAuthentication} from "../hooks/authenticationHooks";
import {Copyright} from "../components/Copyright";

export const Start = () => {
    const authenticatonHook = AppAuthentication();

    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Welcome to Zenon Wallet
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={authenticatonHook.showImportExistingWallet}
                    >
                        Import your wallet
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={authenticatonHook.showCreateWallet}
                    >
                        Create new wallet
                    </Button>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
    );
}
