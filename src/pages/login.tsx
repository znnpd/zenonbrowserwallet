import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {AppAuthentication} from "../hooks/authenticationHooks";
import {Copyright} from "../components/Copyright";
import Link from "@mui/material/Link";
import {Link as RouterLink} from 'react-router-dom';
import {useLocation} from "react-router-dom";
const queryString = require('query-string');

export const LogIn = () => {
    const authenticatonHook = AppAuthentication();

    // Check if navigation params exist in url (if opened from a website)
    const location = useLocation();
    const params = queryString.parse(location.search);
    if (params.data) {
        var originSender = params.originSender;
        var tabIdSender = params.tabIdSender;
        var navigateTo = params.navigateTo;
        var data = params.data;
    }
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let password = formData.get("password") as string;
        if (password.length > 0) {
            authenticatonHook.doSignIn(password, navigateTo, tabIdSender, originSender, data);
        }
    };

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
                    <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Unlock your wallet
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link component={RouterLink} to="/import">Import your wallet?</Link>
                            </Grid>
                            <Grid item>
                                <Link component={RouterLink} to="/create">Create new wallet?</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box sx={{mt: 8}}/>
            </Container>
    );
}
