import * as React from 'react';
import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Drawer, Grid, Modal} from '@mui/material';
import {ChartBar as ChartBarIcon} from '../../icons/chart-bar';
import {Lock as LockIcon} from '../../icons/lock';
import {User as UserIcon} from '../../icons/user';
import {UserAdd as UserAddIcon} from '../../icons/user-add';
import {Users as UsersIcon} from '../../icons/users';
import {NavItem} from './nav-item';
import {AppAuthentication} from "../../hooks/authenticationHooks";
import CloseIcon from '@mui/icons-material/Close';
import {CommonHooks} from "../../hooks/commonHooks";
import {WalletHooks} from "../../hooks/walletHooks";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const DashboardSidebar = (props) => {

    const [deleteWalletDialog, setDeleteWalletDialog] = React.useState(false);
    const {open, onClose} = props;
    const commonHooks = CommonHooks();
    let auth = AppAuthentication();

    useEffect(
        () => {
            if (open) {
                onClose?.();
            }
        },
        [open, onClose]
    );

    const walletHooks = WalletHooks();

    const deleteWallet = (event) => {
        event.preventDefault();
        commonHooks.closeSidebar();
        auth.doDeleteWallet();
        setDeleteWalletDialog(false);
    }


    const items = [
        {
            href: '/',
            icon: (<ChartBarIcon fontSize="small"/>),
            title: 'Overview',
            authenticated: true,
            hook: walletHooks.refreshWalletAddressData
        },
        {
            href: '/send',
            icon: (<UsersIcon fontSize="small"/>),
            title: 'Send',
            authenticated: true
        },
        {
            href: '/transactions',
            icon: (<UserIcon fontSize="small"/>),
            title: 'Transactions',
            authenticated: true,
            hook: walletHooks.refreshWalletAddressData
        },
        {
            href: '/siteapproval',
            icon: (<UserAddIcon fontSize="small"/>),
            title: 'Trusted sites',
            authenticated: true
        },
        {
            icon: (<LockIcon fontSize="small"/>),
            title: 'Logout',
            authenticated: true,
            hook: walletHooks.lockWallet
        },
        {
            icon: (<LockIcon fontSize="small"/>),
            title: 'Delete Wallet',
            authenticated: true,
            hook: () => setDeleteWalletDialog(true)
        },
        {
            href: '/login',
            icon: (<LockIcon fontSize="small"/>),
            title: 'Login',
            authenticated: false
        },
        {
            href: '/import',
            icon: (<UserAddIcon fontSize="small"/>),
            title: 'Import Wallet',
            authenticated: false
        },
        {
            href: '/create',
            icon: (<UserAddIcon fontSize="small"/>),
            title: 'Create Wallet',
            authenticated: false
        }
    ];

    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <div>
                    <CloseIcon onClick={commonHooks.closeSidebar} color="primary" sx={{float: 'right'}}/>
                </div>
                <Box sx={{flexGrow: 1}}>
                    {items.filter(item => item.authenticated === auth.isUnlocked()).map((item) => (
                        <NavItem
                            key={item.title}
                            icon={item.icon}
                            href={item.href}
                            title={item.title}
                            hook={item.hook}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );

    return (
        <>
            <Drawer
                anchor="left"
                onClose={onClose}
                open={open}
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.900',
                        color: '#FFFFFF',
                        width: 280
                    }
                }}
                sx={{zIndex: (theme) => theme.zIndex.appBar + 100}}
                variant="temporary"
            >
                {content}
            </Drawer>
            <Modal open={deleteWalletDialog}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh', backgroundColor: 'black' }}
                >
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.primary" align="center">
                            Do you really want to delete your wallet? Only your seed can recover it!
                        </Typography>
                        <Button
                            onClick={() => setDeleteWalletDialog(false)}
                            variant="contained"
                            sx={{mt: '8px', mb: 3, ml: 7}}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) => deleteWallet(e)}
                            variant="contained"
                            sx={{mb: 2, ml: 7}}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
