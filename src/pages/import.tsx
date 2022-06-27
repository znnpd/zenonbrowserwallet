import * as React from "react";
import {AppAuthentication} from "../hooks/authenticationHooks";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Layout} from "../components/layout";

export const ImportPage = () => {
    const authenticatonHook = AppAuthentication();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let mnemonic = formData.get("mnemonic") as string;
        let password = formData.get("password") as string;
        if (password.length > 0 && mnemonic.length > 0) {
            authenticatonHook.doImportExistingWallet(mnemonic, password);
        }
    };

    return (
        <Layout title="Import Wallet">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="mnemonic"
                    label="Mnemonic"
                    type="password"
                    id="mnemonic"
                    autoComplete="you mnemonic seed"
                />
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
                    Import your wallet
                </Button>
            </Box>
        </Layout>
    );
}
