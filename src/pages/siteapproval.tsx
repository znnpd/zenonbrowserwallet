/*global chrome*/
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {Box, Card} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {Layout} from "../components/layout";
import {WalletHooks} from "../hooks/walletHooks";
import {makeStyles} from "@mui/styles";
import PerfectScrollbar from 'react-perfect-scrollbar';


const queryString = require('query-string');

export const SiteApproval = (props) => {

    const walletHook = WalletHooks();
    
    // Handle trustedSites state
    let [trustedSitesState, setTrustedSites] = useState<string[]>([]);

    let baseAddress = walletHook.getAccountInfo().address;

    function trustOrigin(isTrusted: boolean) {

        if (isTrusted) {
            trustedSitesState.push(originSender!);
            chrome.storage.local.set({'trustedSites': JSON.stringify(trustedSitesState)}, function() {
                // no async processing needed
            });
            setTrustedSites(trustedSitesState);
        }

        // Send message direct to content script
        chrome.tabs.sendMessage(parseInt(tabIdSender!), {
            direction: 'toWebsite',
            action: 'CONNECT_WALLET_RESPONSE',
            data: {
                isSiteTrusted: isTrusted,
                TrustedSite: originSender,
                baseAddress: baseAddress
            },
            extensionId: chrome.runtime.id
        }); // no response expected

        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab!.id!, function() { });
        });
    }

    const location = useLocation();
    const params = queryString.parse(location.search);
    let originSender = params.originSender;
    let tabIdSender = params.tabIdSender;

    // Remove a trusted site
    function deleteTrustedSite(index: number) {
        trustedSitesState.splice(index,1);
        setTrustedSites(trustedSitesState);

        chrome.storage.local.set({'trustedSites': JSON.stringify(trustedSitesState)}, function() {
            // no async processing needed
        });
    }

    // ListItems of trusted sites
    function setList() {
        return trustedSitesState.map((element, index) => {
            return (<ListItem disablePadding key={index}
                        secondaryAction={
                            <IconButton aria-label="delete" onClick={() => deleteTrustedSite(index)}>
                                <DeleteForeverIcon />
                            </IconButton>
                        }>
                            <ListItemText primary={element} />
                    </ListItem>);
        });
    }

    // Read trustedSites from storage and put them in the state
    useEffect(() => {
        if(chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['trustedSites'], function (result) {
                if (result.trustedSites) {
                    result.trustedSites = JSON.parse(result.trustedSites);
                } else {
                    result.trustedSites = [];
                }
                setTrustedSites(result.trustedSites);
            });
        }

    }, []);

    const useStyles = makeStyles((theme) => ({
        row: {
            cursor: "pointer",
        },
        hover: {
            "&:hover": {
                backgroundColor: "green !important",
                color: " #fff !important",
            },
        },
        column: {
            color: "inherit !important",
        },
    }));
    const classes = useStyles();

    return (
        <Layout title="Trusted Sites">
            <Box>
                <Card {...props}>
                    <Box sx={{minWidth: 400}}>
                        <Table>
                            <TableHead>
                            </TableHead>
                            <TableBody>
                                {trustedSitesState.map((trustedSite, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={index}
                                            className={classes.hover}
                                        >
                                            <TableCell>
                                                {trustedSite}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="delete" onClick={() => deleteTrustedSite(index)}>
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        )}
                                )}                                
                            </TableBody>
                        </Table>
                    </Box>
                </Card>
                <Box
                    m={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={!originSender? {display: 'none'} : null}
                    >
                    <div>Do you trust this website: {originSender}?</div>
                </Box>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={!originSender? {display: 'none'} : null}
                    >
                    <Button variant="outlined" color="primary" sx={{m:1, height: 40 }} onClick={() => {
                        trustOrigin(true);
                    }}>
                        Yes
                    </Button>
                    <Button variant="outlined" color="primary" sx={{m:1, height: 40 }} onClick={() => {
                        trustOrigin(false);
                    }}>
                        No
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};
