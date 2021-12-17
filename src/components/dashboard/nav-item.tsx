import PropTypes from 'prop-types';
import { Box, Button, ListItem } from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import * as React from "react";
import {useAuth} from "../auth-provider/auth-provider";

interface NavItemProps {
    href?: any,
    icon?: any,
    title?: string,
    onClick?: () => void;
}

export const NavItem = (props: NavItemProps) => {
  const { href, icon, title, onClick, ...others } = props;
  const location = useLocation();
    let auth = useAuth();
    let navigate = useNavigate();
  const active = href ? (location.pathname === href) : false;

    const handleClick = (event: React.FormEvent<HTMLFormElement>, href) => {
        event.preventDefault();
        if(href === '/logout') {
            auth.signout(() => {
                navigate('/login', {replace: true});
            });
        }else{
            navigate(href, {replace: true});
        }
    };

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2
      }}
      {...others}
    >
        <Button
          component="a"
          startIcon={icon}
          disableRipple
          onClick={(e) => handleClick(e, href)}
          sx={{
            backgroundColor: active ? 'rgba(255,255,255, 0.08)': '',
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            fontWeight: active ? 'fontWeightBold' : '',
            justifyContent: 'flex-start',
            px: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400'
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {title}
          </Box>
        </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string
};
