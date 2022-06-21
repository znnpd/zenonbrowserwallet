import {createTheme, ThemeOptions} from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        text:{
            primary: '#fff',
        },
        primary: {
            main: '#3bda57',
        },
        background: {
            default: '#111111',
            paper: '#212121',
        },
        secondary: {
            main: '#446aef',
        },
        action: {
            active: '#fff',
            hover: '#fff',
            focus: '#fff',
            selected: '#fff',
        },
    },
    typography: {
        fontFamily: 'Helvetica',
        h1: {
            fontFamily: 'Helvetica',
        },
        h2: {
            fontFamily: 'Helvetica',
        },
        h3: {
            fontFamily: 'Helvetica',
        },
        h4: {
            fontFamily: 'Helvetica',
        },
        h6: {
            fontFamily: 'Helvetica',
        },
        h5: {
            fontFamily: 'Helvetica',
        },
        subtitle1: {
            fontFamily: 'Helvetica',
        },
        subtitle2: {
            fontFamily: 'Helvetica',
        },
        button: {
            fontFamily: 'Helvetica',
            fontWeight: 900,
        },
        overline: {
            fontFamily: 'Helvetica'
        },
    },
};

export const theme = createTheme(themeOptions);

export const doughnutStyling = {
    cutoutPercentage: 80,
    layout: {padding: 0},
    legend: {
        display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
        backgroundColor: theme.palette.background.paper,
        bodyFontColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        enabled: true,
        footerFontColor: theme.palette.text.secondary,
        intersect: false,
        mode: 'index',
        titleFontColor: theme.palette.text.primary
    }
};
