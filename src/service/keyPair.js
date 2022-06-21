import { getPublicKey } from "ed25519-hd-key";
import { SHA3 } from "sha3";
import { sign } from 'noble-ed25519';

import { Address } from './address';

class KeyPair {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.publicKey = getPublicKey(privateKey, false);
        this.address = new Address(Buffer.concat([Uint8Array.from([0]), SHA3(256).update(this.publicKey).digest().subarray(0, 19)]))
    }

    static FromPrivateKey(privateKey) {
        return new KeyPair(privateKey)
    }

    sign(data) {
        return sign(data.core, this.privateKey.toString('hex')).then(Buffer.from);
    }
}

export {
    KeyPair
};
