import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../../icons/chart-bar';
import { Lock as LockIcon } from '../../icons/lock';
import { Selector as SelectorIcon } from '../../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../../icons/shopping-bag';
import { User as UserIcon } from '../../icons/user';
import { UserAdd as UserAddIcon } from '../../icons/user-add';
import { Users as UsersIcon } from '../../icons/users';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../auth-provider/auth-provider";
import * as React from "react";

const items = [
  {
    href: '/',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Wallet',
    authenticated: true
  },
  {
    href: '/send',
    icon: (<UsersIcon fontSize="small" />),
    title: 'send',
      authenticated: true
  },
  {
    href: '/receive',
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'receive',
      authenticated: true
  },
  {
    href: '/transactions',
    icon: (<UserIcon fontSize="small" />),
    title: 'Transactions',
      authenticated: true
  },
  {
    href: '/logout',
    icon: (<LockIcon fontSize="small" />),
    title: 'Logout',
      authenticated: true,
      logout: true
  },
    {
        href: '/login',
        icon: (<LockIcon fontSize="small" />),
        title: 'Login',
        authenticated: false
    },
  {
    href: '/add',
    icon: (<UserAddIcon fontSize="small" />),
    title: 'Add Wallet',
      authenticated: false
  },
  {
    href: '/create',
    icon: (<UserAddIcon fontSize="small" />),
    title: 'Create Wallet',
      authenticated: false
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useLocation();
    let auth = useAuth();
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
    [router.pathname]
  );

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
          <Box sx={{ p: 3 }}>
            <Link
              to="/"
            >
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
            </Link>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  Acme Inc
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Your tier
                  {' '}
                  : Premium
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.filter(item => item.authenticated === (auth.wallet !== undefined)).map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
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
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
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
