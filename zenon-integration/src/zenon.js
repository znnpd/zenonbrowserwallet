const znn = require("../../../znn.js/src");
const crypto = require('crypto-browserify');
const bip39 = require('bip39');

async function createNewWallet(password) {
    var entropy = new Buffer.from(crypto.randomBytes(32), 'utf8');
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

async function importExistingWallet(mnemonic, password) {
    var entropy = bip39.mnemonicToEntropy(mnemonic)
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

module.exports = {createNewWallet, importExistingWallet};