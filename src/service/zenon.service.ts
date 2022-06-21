import {Client, RequestManager, WebSocketTransport} from "@open-rpc/client-js";
import {nodeIp, nodePort} from '../config/default';
import {KeyStore} from './keyStore';
import {KeyFile} from "./keyFile";
import {Hash} from './hash';
import {AccountBlock} from './accountBlock';
import {Address} from "./address";
import {HashHeight} from "./hashHeight";
import {emptyZts, qsrZts, TokenStandard, znnZts} from "./tokenStandard";
import * as zenonInterfaces from './zenon.service.interfaces';

export const znnTokenStandard = znnZts;
export const qsrTokenStandard = qsrZts;
export const emptyTokenStandard = emptyZts;

const BlockTypes = {
    unknown: 0,
    genesisReceive: 1,
    userSend: 2,
    userReceive: 3,
    contractSend: 4,
    contractReceive: 5
};

export class ZenonService {

    // RPC client
    //readonly transport = new HTTPTransport('http://' + nodeIp + ':' + nodePort);
    readonly transport = new WebSocketTransport('ws://' + nodeIp + ':' + nodePort);
    requestManager = new RequestManager([this.transport]);
    client = new Client(this.requestManager);

    readonly textEncoder = new TextEncoder();
    readonly textDecoder = new TextDecoder("utf-8");

    closeWsConnection = () => {
        this.client.close();
    }

    decryptWallet = async (password: string): Promise<zenonInterfaces.IWallet> => {
        let walletString = localStorage.getItem('wallet');
        if (walletString) {
            let wallet: zenonInterfaces.IWallet = JSON.parse(walletString);
            let entropy = await KeyFile.Decrypt(wallet, password);
            return wallet;
        } else {
            throw new Error("No wallet found");
        }
    }

    deleteWallet = () => {
        localStorage.removeItem('wallet');
    }

    encryptWallet = async (password: string): Promise<zenonInterfaces.IWallet> => {
        let walletString = localStorage.getItem('wallet');
        if (walletString) {
            let wallet: zenonInterfaces.IWallet = JSON.parse(walletString);
            let encryptedWallet = await KeyFile.Encrypt(wallet, password);
            return encryptedWallet;
        } else {
            throw new Error("No wallet found");
        }
    };

    createNewWallet = async (password: string): Promise<zenonInterfaces.IWallet> => {
        let wallet = await KeyFile.Encrypt(KeyStore.Random(), password);
        return wallet;
    }

    importExistingWallet = async (mnemonic: string, password: string): Promise<zenonInterfaces.IWallet> => {
        let entropy = KeyStore.FromMnemonic(mnemonic);
        let wallet = await KeyFile.Encrypt(entropy, password);
        return wallet;
    }

    getAccountInfo = async (address: string): Promise<zenonInterfaces.IAccountInfo> => {
        return this.client.request({method: 'ledger.getAccountInfoByAddress', params: [address]});
    }

    getLatestAccountBlocks = async (address: string, pageIndex: number, pageSize: number):Promise<zenonInterfaces.IAccountBlock[]> => {
        let response = await this.client.request({method: 'ledger.getAccountBlocksByPage', params: [address, pageIndex, pageSize] });
        return response.list;
    }

    getLatestTransactions = async (address: string, pageIndex: number, pageSize: number): Promise<zenonInterfaces.ITransaction[]> => {
        var latestAccountBlocks: zenonInterfaces.IAccountBlock[] = await this.getLatestAccountBlocks(address, pageIndex, pageSize);
        var transactions: zenonInterfaces.ITransaction[] = [];
        latestAccountBlocks.forEach(item => {
            var transaction: zenonInterfaces.ITransaction = {
                sender: item.blockType === BlockTypes.userSend ? item.address : item.pairedAccountBlock!.address,
                receiver: item.blockType === BlockTypes.userSend ? item.toAddress : item.pairedAccountBlock!.toAddress,
                amount: item.blockType === BlockTypes.userSend ? item.amount / Math.pow(10, item.token!.decimals) : item.pairedAccountBlock!.amount / Math.pow(10, item.pairedAccountBlock!.token!.decimals),
                token: item.blockType === BlockTypes.userSend ? item.token!.symbol : item.pairedAccountBlock!.token!.symbol,
                hash: item.blockType === BlockTypes.userSend ? item.hash : item.pairedAccountBlock!.hash,
                confirmationTimestampUTC: item.blockType === BlockTypes.userSend ? new Date(item.confirmationDetail!.momentumTimestamp * 1000).toISOString() : new Date(item.pairedAccountBlock!.confirmationDetail!.momentumTimestamp * 1000).toISOString(),
                blockHeight: item.height,
                direction: item.blockType === BlockTypes.userSend ? 'send' : 'receive'
            }
            transactions.push(transaction);
        });
        return transactions;
    }

    getUnreceivedBlocksByAddress = async (address: string, pageIndex: number, pageSize: number): Promise<zenonInterfaces.IUnreceivedBlocks> => {
        return this.client.request({method: 'ledger.getUnreceivedBlocksByAddress', params: [address, pageIndex, pageSize]});
    }

    deriveAddress = async (index: number, password: string): Promise<zenonInterfaces.IAddress> => {
        let wallet: zenonInterfaces.IWallet = JSON.parse(localStorage.getItem('wallet') as string);
        let store = await KeyFile.Decrypt(wallet, password);
        let address = store.getKeyPair(index).address;
        return address;

    }
    receiveAllTransactions = async (addressString: string, password: string): Promise<void> => {
        let pageSize: number = 20;
        let pageIndex: number = 0;
        let address = Address.Parse(addressString);
        let wallet: zenonInterfaces.IWallet = JSON.parse(localStorage.getItem('wallet') as string);

        let unreceivedBlocksResponse = await this.getUnreceivedBlocksByAddress(address.toString(), pageIndex, pageSize);
        let unreceivedBlocks: zenonInterfaces.IAccountBlock[] = unreceivedBlocksResponse.list;
        while (unreceivedBlocks.length < unreceivedBlocksResponse.count) {
            unreceivedBlocksResponse = await this.getUnreceivedBlocksByAddress(address.toString(), pageIndex, pageSize);
            unreceivedBlocks = unreceivedBlocksResponse.list;
        }

        if (unreceivedBlocks.length > 0) {
            let entropy = await KeyFile.Decrypt(wallet, password);
            let keyPair = entropy.getKeyPair();
            let block: zenonInterfaces.IAccountBlock = new AccountBlock();

            block.blockType = BlockTypes.userReceive;
            block.address = address;

            for (let i = 0; i < unreceivedBlocks.length; i++) {
                let fromBlockHash = Hash.Parse(unreceivedBlocks[i].hash);
                block.fromBlockHash = fromBlockHash
                await this.fastForwardBlock(block, keyPair);
            }
        }
    }

    getTokenByZts = async (zts: string) =>{
        return this.client.request({method: 'embedded.token.getByZts', params: [zts]});
    }

    sendTransaction = async (addressFrom: string, addressTo: string, amount: number, tokenStandard: string, password: string): Promise<zenonInterfaces.ITransaction> => {
        let zts = undefined;
        try {
            zts = await this.getTokenByZts(tokenStandard);
        } catch (error) {
            let errorMsg = 'Token Standard ' + tokenStandard + ' not supported!';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        
        let block: zenonInterfaces.IAccountBlock = new AccountBlock();
        try {
            block.address = Address.Parse(addressFrom);
        } catch (error) {
            let errorMsg = 'Address "' + addressFrom + '" invalid!';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        
        try {
            block.address = Address.Parse(addressTo);
        } catch (error) {
            let errorMsg = 'Address "' + addressTo + '" invalid!';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        let decimals: number = 0;
        if (zts) {
            decimals = parseInt(zts?.['decimals']);
        }
        
        block.amount = parseInt((amount * Math.pow(10, decimals)).toFixed());  // Might have little rounding issues
        
        block.tokenStandard = TokenStandard.Parse(tokenStandard);
        block.blockType = BlockTypes.userSend;
        
        let wallet: zenonInterfaces.IWallet = JSON.parse(localStorage.getItem('wallet') as string);
        let entropy = await KeyFile.Decrypt(wallet, password);
        let keyPair = entropy.getKeyPair();
        
        return this.fastForwardBlock(block, keyPair);
    }

    fastForwardBlock = async (block: zenonInterfaces.IAccountBlock, keyPair) => {
        
        block.publicKey = keyPair.publicKey;

        const frontier = await this.client.request({
            method: 'ledger.getFrontierAccountBlock',
            params: [block.address.toString()]
        });
        
        if (frontier == null) {
            block.height = 1;
        } else {
            block.height = frontier.height + 1;
            block.previousHash = Hash.Parse(frontier.hash);
        }
        
        const momentum = await this.client.request({method: 'ledger.getFrontierMomentum', params: []});
        block.momentumAcknowledged = new HashHeight(momentum.height, Hash.Parse(momentum.hash));
        
        let powParam = {
            address: block.address.toString(),
            blockType: block.blockType,
            toAddress: block.toAddress.toString(),
            data: ""
        }
        
        // set plasma, fail in case of not enough
        const required = await this.client.request({
            method: 'embedded.plasma.getRequiredPoWForAccountBlock',
            params: [powParam]
        });
        
        if (required.requiredDifficulty !== 0) {
            throw new Error(`znn.js is not able to produce plasma using PoW. Please fuse to ${block.address.toString()}`);
        }
        
        block.fusedPlasma = required.basePlasma;
        block.hash = block.getHash();
        block.signature = await keyPair.sign(block.hash);
        
        return await this.client.request({method: 'ledger.publishRawTransaction', params: [block.toJson()]});
    }
}
