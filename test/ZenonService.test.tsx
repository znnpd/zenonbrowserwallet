import { setUncaughtExceptionCaptureCallback } from 'process';
import React from 'react';
import {ZenonService} from "../src/service/zenon.service";
import *  as zenonInterfaces from '../src/service/zenon.service.interfaces';
const service = new ZenonService();

afterEach(() => {
    window.localStorage.clear();
});

describe("ZenonService", () => {
   it('should create a new wallet', async () => {
        const wallet = await service.createNewWallet("mySuperPassword");
        expect(wallet).toMatchSnapshot({
            baseAddress: expect.any(String),
            crypto: {
                argon2Params: {
                    salt: expect.any(String)
                },
                cipherData: expect.any(String),
                nonce: expect.any(String)
            },
            timestamp: expect.any(Number)
        });
    });

    it('should import an existing wallet', async () => {
        var wallet = await service.importExistingWallet(process.env.RECEIVER_MNEMONIC!, "mySuperPassword!");
        expect(wallet).toMatchSnapshot({
            crypto: {
                argon2Params: {
                    salt: expect.any(String)
                },
                cipherData: expect.any(String),
                nonce: expect.any(String)
            },
            timestamp: expect.any(Number)
        });
    });

    it('should read account infos properly', async () => {
        var accountInfo: zenonInterfaces.IAccountInfo = await service.getAccountInfo(process.env.RECEIVER_ADDRESS!);
        expect(accountInfo).toMatchSnapshot({
            accountHeight: expect.any(Number),
            balanceInfoMap: {
                zts1znnxxxxxxxxxxxxx9z4ulx: {
                    balance: expect.any(Number),
                    token: {
                        totalSupply: expect.any(Number)
                    }
                },
                zts1ydn3h4qw6y67k8hltv0flh: {
                    balance: expect.any(Number),
                    token: {
                        totalSupply: expect.any(Number)
                    }
                },
                zts1qsrxxxxxxxxxxxxxmrhjll: {
                    balance: expect.any(Number),
                    token: {
                        totalSupply: expect.any(Number)
                    }
                }
            }
            
        });
    });
    it('should send transactions properly', async () => {
        if (!process.env.SENDER_MNEMONIC || !process.env.SENDER_ADDRESS) {
            console.error('Make sure to use dotenv and that .env contains SENDER_MNEMONIC, SENDER_ADDRESS and RECEIVER_ADDRESS');
            return
        }
        var wallet = await service.importExistingWallet(process.env.SENDER_MNEMONIC!, "mySuperPassword!");
        window.localStorage.setItem('wallet', JSON.stringify(wallet));
        await service.sendTransaction(process.env.SENDER_ADDRESS!, process.env.RECEIVER_ADDRESS!, 0.000001, 'zts1znnxxxxxxxxxxxxx9z4ulx', 'mySuperPassword!');
    });

    it('should receive transactions properly', async () => {
        if (!process.env.RECEIVER_MNEMONIC || !process.env.RECEIVER_ADDRESS) {
            console.error('Make sure to use dotenv and that .env contains RECEIVER_MNEMONIC and RECEIVER_ADDRESS');
            return
        }
        var wallet = await service.importExistingWallet(process.env.RECEIVER_MNEMONIC!, "mySuperPassword!");
        window.localStorage.setItem('wallet', JSON.stringify(wallet));
        await service.receiveAllTransactions(process.env.RECEIVER_ADDRESS!, 'mySuperPassword!');
    });


    it('should read transactions properly', async () => {
        var accountInfo: zenonInterfaces.IAccountInfo = await service.getAccountInfo(process.env.RECEIVER_ADDRESS!);
        var transactions: zenonInterfaces.ITransaction[] = await service.getLatestTransactions(process.env.RECEIVER_ADDRESS!, accountInfo.accountHeight - 1, 1); 
        expect(transactions).toMatchSnapshot();
    });

    it('should receive derived addresses', async () => {
        if (!process.env.RECEIVER_MNEMONIC || !process.env.RECEIVER_ADDRESS) {
            console.error('Make sure to use dotenv and that .env contains RECEIVER_MNEMONIC and RECEIVER_ADDRESS');
            return
        }
        var wallet = await service.importExistingWallet(process.env.RECEIVER_MNEMONIC!, "mySuperPassword!");
        window.localStorage.setItem('wallet', JSON.stringify(wallet));
        let address = await service.deriveAddress(1, 'mySuperPassword!');
        expect(address.toString()).toMatchSnapshot();
    });

    it('should close the websocket connection', () => {
        service.closeWsConnection();
    });
});
