import * as React from 'react';
import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Drawer} from '@mui/material';
import {ChartBar as ChartBarIcon} from '../../icons/chart-bar';
import {Lock as LockIcon} from '../../icons/lock';
import {ShoppingBag as ShoppingBagIcon} from '../../icons/shopping-bag';
import {User as UserIcon} from '../../icons/user';
import {UserAdd as UserAddIcon} from '../../icons/user-add';
import {Users as UsersIcon} from '../../icons/users';
import {NavItem} from './nav-item';
import {useLocation} from "react-router-dom";
import {AppAuthentication} from "../../hooks/authenticationHooks";
import CloseIcon from '@mui/icons-material/Close';
import {CommonHooks} from "../../hooks/commonHooks";
import {WalletHooks} from "../../hooks/walletHooks";

export const DashboardSidebar = (props) => {
    const {open, onClose} = props;
    const router = useLocation();
    const commonHooks = CommonHooks();
    let auth = AppAuthentication();
    const lgUp = false;
    /*const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
      defaultMatches: true,
      noSsr: false
    });*/

    useEffect(
        () => {
            if (open) {
                onClose?.();
            }
        },
        [router.pathname, open, onClose]
    );

    const walletHooks = WalletHooks();

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
            hook: auth.doDeleteWallet
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

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.900',
                        color: '#FFFFFF',
                        width: 280
                    }
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
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
    );
};

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
