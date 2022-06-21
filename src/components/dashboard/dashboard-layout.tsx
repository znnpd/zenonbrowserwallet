import * as React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {DashboardNavbar} from './dashboard-navbar';
import {DashboardSidebar} from './dashboard-sidebar';
import {Outlet} from "react-router-dom";
import {CommonHooks} from "../../hooks/commonHooks";

const DashboardLayoutRoot = styled('div')(({theme}) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
}));

export const DashboardLayout = (props) => {
    const commonHooks = CommonHooks();

    return (
        <>
            <DashboardLayoutRoot>
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                        width: '100%'
                    }}
                >
                    <Outlet/>
                </Box>
            </DashboardLayoutRoot>
            <DashboardNavbar onSidebarOpen={commonHooks.openSidebar}/>
            <DashboardSidebar
                open={commonHooks.isSidebarOpen()}
            />
        </>
    );
};
