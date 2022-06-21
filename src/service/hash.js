import { SHA3 } from "sha3";

class Hash {
    constructor(core) {
        this.core = core;
    }

    toString() {
        return this.core.toString("hex");
    }

    static Parse(hexString) {
        return new Hash(Buffer.from(hexString, "hex"));
    }

    static Digest(data) {
        return new Hash(SHA3(256).update(data).digest());
    }
}
const emptyHash = Hash.Parse("0000000000000000000000000000000000000000000000000000000000000000");
export {
    Hash,
    emptyHash,
};