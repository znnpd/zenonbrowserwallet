const znn = require('../../../znn.js/src');
import {nodeIp, nodeHttpPort, netId} from './config';
const crypto = require('crypto-browserify');
const bip39 = require('bip39');
import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import * as ed from '@noble/ed25519';
const {SHA3} = require("sha3");
import { Buffer } from 'buffer';

// RPC client
const transport = new HTTPTransport('http://' + nodeIp + ':' + nodeHttpPort);
const requestManager = new RequestManager([transport]);
const client = new Client(requestManager);

const znnTokenStandard = 'zts1znnxxxxxxxxxxxxx9z4ulx';
const qsrTokenStandard = 'zts1qsrxxxxxxxxxxxxxmrhjll';
const emptyTokenStandard = 'zts1qqqqqqqqqqqqqqqqtq587y';

export async function createNewWallet(password) {
    var entropy = new Buffer.from(crypto.randomBytes(32), 'utf8');
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

export async function importExistingWallet(mnemonic, password) {
    var entropy = new Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex');
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

export function getAccountInfo(address) {
    return client.request({method: 'ledger.getAccountInfoByAddress', params: [address]});
}

export async function sendTransaction(addressFrom, addressTo, amount, tokenStandard, password) {
    let accountBlock = initAccountBlock();
    accountBlock.address = addressFrom;
    accountBlock.toAddress = addressTo;
    accountBlock.amount = amount;
    accountBlock.tokenStandard = tokenStandard;
    
    const frontierAccountBlock = await client.request({method: 'ledger.getFrontierAccountBlock', params: [addressFrom]});
    if (frontierAccountBlock !== null) {
        accountBlock.height = frontierAccountBlock.height + 1;
        accountBlock.previousHash = frontierAccountBlock.hash;
    }
    
    const frontierMomentum = await client.request({method: 'ledger.getFrontierMomentum', params: []});
    const momentumAcknowledged = {
        height: frontierMomentum.height,
        hash: frontierMomentum.hash
    };
    accountBlock.momentumAcknowledged = momentumAcknowledged;
    
    const powParam = {
        address: accountBlock.address,
        blockType: accountBlock.blockType,
        toAddress: accountBlock.toAddress,
        data: ""
    }
    
    var requiredPow = await client.request({method: 'embedded.plasma.getRequiredPoWForAccountBlock', params: [powParam]});
    if (requiredPow.requiredDifficulty !== 0) {
        console.error('ERROR: Transactions with PoW not supported yet!');
        return;
    } else {
        accountBlock.fusedPlasma = requiredPow.basePlasma;
    }
    
    var wallet = JSON.parse(localStorage.getItem('wallet'));
    let entropy;
    try {
        entropy = await znn.wallet.KeyFile.Decrypt(wallet, password);
    } catch (error) {
        console.error(error)   
    } 
    
    var transactionToHash = Buffer.concat([
        longToBytes(accountBlock.version),
        longToBytes(accountBlock.chainIdentifier),
        longToBytes(accountBlock.blockType),
        accountBlock.previousHash,
        longToBytes(accountBlock.height),
        accountBlock.momentumAcknowledged.hash,
        longToBytes(accountBlock.momentumAcknowledged.height),
        accountBlock.address,
        accountBlock.toAddress,
        bigIntToBytes(accountBlock.amount),
        accountBlock.tokenStandard,
        accountBlock.fromBlockHash,
        SHA3(256).update(buffer.alloc(0)).digest(),
        SHA3(256).update(accountBlock.data).digest(),
        longToBytes(accountBlock.fusedPlasma),
        longToBytes(accountBlock.difficulty),
        this.nonce
    ]);
    
    accountBlock.hash = SHA3(256).update(JSON.stringify(transactionToHash)).digest();
    const keyPair = znn.wallet.KeyPair.FromEntropy(entropy);
    const signature = await ed.sign(accountBlock.hash, keyPair.privateKey);
    accountBlock.signature = signature.toString('hex');
    accountBlock.publicKey = keyPair.publicKey.toString('base64');
    console.log(accountBlock);
    return client.request({method: 'ledger.publishRawTransaction', params: [accountBlock]});
    
}
function longToBytes(value) {
    let b = Buffer.alloc(8);
    b.writeUInt32BE(value, 4);
    return b;
}

function bigIntToBytes(value) {
    let b = Buffer.alloc(32);
    b.writeBigUInt64BE(BigInt(value), 24);
    return b;
}

function initAccountBlock() {
    const emptyHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const emptyHashHeight = {
        height: 0,
        hash: emptyHash
    };
    const emptyTokenStandard = 'zts1qqqqqqqqqqqqqqqqtq587y';
    let accountBlock = {};
    accountBlock.version = 1;
    accountBlock.blockType = 2;  // 2: Send
    accountBlock.fromBlockHash = emptyHash;
    accountBlock.chainIdentifier = netId;
    accountBlock.hash = emptyHash;
    accountBlock.previousHash = emptyHash;
    accountBlock.height = 0;
    accountBlock.momentumAcknowledged = emptyHashHeight;
    accountBlock.address = null;
    accountBlock.toAddress = null;
    accountBlock.amount = 0;
    accountBlock.tokenStandard = emptyTokenStandard;
    accountBlock.fusedPlasma = 0;
    accountBlock.data = '';
    accountBlock.difficulty = 0;
    accountBlock.nonce = '0000000000000000';
    accountBlock.publicKey = null;
    accountBlock.signature = null;
    return accountBlock;
}