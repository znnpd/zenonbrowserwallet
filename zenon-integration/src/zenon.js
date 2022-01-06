const znn = require('../../../znn.js/src');
const crypto = require('crypto-browserify');
const bip39 = require('bip39');
const rpc = require('./rpc');
require('dotenv').config({ path: './.env' });

async function createNewWallet(password) {
    var entropy = new Buffer.from(crypto.randomBytes(32), 'utf8');
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

async function importExistingWallet(mnemonic, password) {
    var entropy = new Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex');
    const wallet = JSON.stringify(await znn.wallet.KeyFile.Encrypt(entropy, password));
    localStorage.setItem('wallet', wallet);
}

async function getBalance(address) {
    rpc.sendRpcRequest('ledger.getAccountInfoByAddress', [address]).then((result) => {
        return result;
    });
}

module.exports = {createNewWallet, importExistingWallet, getBalance};