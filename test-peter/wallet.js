const znn = require("../../znn.js/src/")
/*const crypto = require("crypto");
const bip39 = require("bip39");
const {getPublicKey, derivePath} = require("ed25519-hd-key");
const {bech32} = require("bech32");

class KeyStore {

    createNewKeystore() {
        this.entropy = new Buffer.from(crypto.randomBytes(32), 'utf8');
        this.mnemonic = bip39.entropyToMnemonic(this.entropy);
        this.seed = bip39.mnemonicToSeedSync(this.mnemonic);
        const {key: priv} = derivePath(`m/44'/73404'/0'`, this.seed);
        this.keyPair = new KeyPair(priv);
        
    } 
}

class KeyPair {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.publicKey = getPublicKey(privateKey, false);
    }
}

*/

function createWallet() {
    /*const keystore = new KeyStore();
    keystore.createNewKeystore();
    console.log(keystore.entropy);
    console.log(keystore.mnemonic);
    console.log(keystore.seed);
    console.log(keystore.keyPair.privateKey);
    console.log(keystore.keyPair.publicKey);*/

}


module.exports = {createWallet};