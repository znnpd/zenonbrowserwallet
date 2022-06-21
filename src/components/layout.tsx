import * as React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Copyright} from "../components/Copyright";
import {ArcElement, Chart} from 'chart.js'

Chart.register(ArcElement);

export const Layout = ({title, children}: { title: string, children: JSX.Element }) => {

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
                    {title}
                </Typography>
                {children}
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                }}
            ></Box>
        </Container>
    );
}
