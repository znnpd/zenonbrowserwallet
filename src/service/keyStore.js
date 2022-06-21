import { mnemonicToEntropy, mnemonicToSeedSync, entropyToMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { KeyPair } from "./keyPair";
import { randomBytes } from "crypto-browserify";

class KeyStore {
    constructor(mnemonic) {
        this.mnemonic = mnemonic;
        this.entropy = mnemonicToEntropy(mnemonic);
        this.seed = mnemonicToSeedSync(mnemonic).toString('hex');
        this.baseAddress = this.getKeyPair().address
    }

    static FromMnemonic(mnemonic) {
        return new KeyStore(mnemonic)
    }

    static FromEntropy(entropy) {
        return new KeyStore(entropyToMnemonic(entropy))
    }

    static Random() {
        return KeyStore.FromEntropy(new Buffer.from(randomBytes(32), 'utf8'))
    }

    getKeyPair(index = 0) {
        const {key} = derivePath(`m/44'/73404'/${index}'`, this.seed);
        return KeyPair.FromPrivateKey(key);
    }
}

export {
    KeyStore
};
