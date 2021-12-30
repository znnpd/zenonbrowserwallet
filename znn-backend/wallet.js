//const znn = require("../../znn.js/src/")
const crypto = require("crypto");
const argon2 = require("argon2-browser");
const bip39 = require("bip39");
const {getPublicKey, derivePath} = require("ed25519-hd-key");
const {bech32} = require("bech32");
const {SHA3} = require("sha3");

class Address {
    constructor(core) {
        this.core = core;
    }

    toString() {
        return bech32.encode("z", bech32.toWords(this.core));
    }

    static Parse(str) {
        try {
            const {prefix, words} = bech32.decode(str);
            let extractedCore = new Buffer.from(bech32.fromWords(words));
            if (prefix !== 'z') {
                throw `invalid prefix ${prefix}; should be 'z'`
            }
            if (extractedCore.length !== 20) {
                throw `invalid length ${extractedCore.length}; should be 20`;
            }
            return new Address(extractedCore)
        } catch (e) {
            throw `failed to parse Address. ${e.toString()}`
        }
    }
}

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
        this.address = new Address(Buffer.concat([Uint8Array.from([0]), SHA3(256).update(this.publicKey).digest().subarray(0, 19)]))
    }
}

async function createWallet() {
    const keystore = new KeyStore();
    keystore.createNewKeystore();
    console.log(keystore.entropy);
    console.log(keystore.mnemonic);
    console.log(keystore.seed);
    console.log(keystore.keyPair.privateKey);
    console.log(keystore.keyPair.publicKey);
    console.log(keystore.keyPair.address.toString());
    var jsonWallet = JSON.stringify(await encrypt(keystore.keyPair.address, 'mySuperPassword'));
    console.log(jsonWallet);

}

async function encrypt(address, password) {
    // generate new salt, as hex string
    let salt = new Buffer.from(crypto.randomBytes(16), 'utf8')

    let key = await argon2.hash({
        pass: password,
        salt: salt,
        time: 1, // the number of iterations
        mem: 64 * 1024, // used memory, in KiB
        parallelism: 4, // desired parallelism (it won't be computed in parallel, however)
        hashLen: 32, // desired hash length
        type: argon2.ArgonType.Argon2id, // Argon2d, Argon2i, Argon2id
    })

    const aesCipher = aes256gcm(key.hash);
    let [encrypted, aesNonce] = aesCipher.encrypt(entropy)

    return {
        baseAddress: address.toString(),
        crypto: {
            argon2Params: {
                salt: "0x" + salt.toString('hex'),
            },
            cipherData: "0x" + encrypted.toString('hex'),
            cipherName: "aes-256-gcm",
            kdf: "argon2.IDKey",
            nonce: "0x" + aesNonce.toString('hex'),
        },
        timestamp: Math.floor(Date.now() / 1000),
        version: 1
    }
}

// https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81
// Demo implementation of using `aes-256-gcm` with node.js's `crypto` lib.
const aes256gcm = (key) => {
    const ALGO = 'aes-256-gcm';

    // encrypt returns base64-encoded ciphertext
    const encrypt = (str) => {
        // The `iv` for a given key must be globally unique to prevent
        // against forgery attacks. `randomBytes` is convenient for
        // demonstration but a poor way to achieve this in practice.
        //
        // See: e.g. https://csrc.nist.gov/publications/detail/sp/800-38d/final
        const nonce = new Buffer.from(crypto.randomBytes(12), 'utf8');
        const cipher = crypto.createCipheriv(ALGO, key, nonce);
        cipher.setAAD(new Buffer.from("zenon", 'utf8'))

        // Hint: Larger inputs (it's GCM, after all!) should use the stream API
        let enc = cipher.update(str, 'utf8', 'hex');
        enc += cipher.final('hex');
        enc += cipher.getAuthTag().toString('hex')
        return [enc, nonce];
    };

    // decrypt decodes base64-encoded ciphertext into a utf8-encoded string
    const decrypt = (enc, iv, authTag) => {
        const decipher = crypto.createDecipheriv(ALGO, key, iv);
        decipher.setAAD(new Buffer.from("zenon", 'utf8'))
        decipher.setAuthTag(authTag);

        let str = decipher.update(enc, undefined, 'hex');
        str += decipher.final('hex');
        return new Buffer.from(str, 'hex');
    };

    return {
        encrypt,
        decrypt,
    };
};

module.exports = {createWallet};