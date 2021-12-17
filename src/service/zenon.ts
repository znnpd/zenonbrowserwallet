export interface Wallet {

}

export default class Zenon {

    decryptWallet = (callback: () => void) => {
        callback();
    }

    encryptWallet = (password: string, callback: (wallet: Wallet) => void) => {
        //do something with password to get a wallet
        let wallet: Wallet = {};
        callback(wallet);
    };

    addWallet = (seed: string, callback: (wallet: Wallet) => void) => {
        //do something with seed
        let wallet: Wallet = {};
        callback(wallet);
    };

    createWallet = (callback: (wallet: Wallet) => void) => {
        //init new wallet
        let wallet: Wallet = {};
        callback(wallet);
    };
}
