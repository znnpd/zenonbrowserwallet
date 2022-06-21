import * as React from "react";
import {AppAuthentication} from "../hooks/authenticationHooks";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Layout} from "../components/layout";

export const CreatePage = () => {
    const authenticatonHook = AppAuthentication();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let password = formData.get("password") as string;
        if (password.length > 0) {
            authenticatonHook.doCreateWallet(password);
        }
    };

    return (
        <Layout title="Create a new wallet">
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
                    Create new wallet
                </Button>
            </Box>
        </Layout>

    );
}
