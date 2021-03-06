import { Address, EmptyAddress } from './address';
import { TokenStandard, emptyZts } from './tokenStandard';
import { Hash, emptyHash } from './hash';
import { HashHeight, emptyHashHeight } from './hashHeight';

function longToBytes (value) {
    let b = Buffer.alloc(8);
    b.writeUInt32BE(value, 4);
    return b;
}
function bigIntToBytes(value) {
    let b = Buffer.alloc(32);
    b.writeBigUInt64BE(BigInt(value), 24);
    return b;
}

class AccountBlock {
    constructor() {
        this.version = 1;
        this.blockType = 0;
        this.fromBlockHash = emptyHash;
        this.chainIdentifier = 1;
        this.hash = emptyHash;
        this.previousHash = emptyHash;
        this.height = 0;
        this.momentumAcknowledged = emptyHashHeight;
        this.address = EmptyAddress;
        this.toAddress = EmptyAddress;
        this.amount = 0;
        this.tokenStandard = emptyZts;
        this.fusedPlasma = 0;
        this.data = Buffer.from("", "hex");
        this.difficulty = 0;
        this.nonce = Buffer.from("0000000000000000", "hex");
        this.publicKey = null;
        this.signature = null;
    }

    static FromJson(json) {
        let ab = new AccountBlock();
        ab.version = json['version'];
        ab.blockType = json['blockType'];
        ab.fromBlockHash = Hash.Parse(json['fromBlockHash']);
        ab.chainIdentifier = json['chainIdentifier'];
        ab.hash = Hash.Parse(json['hash']);
        ab.previousHash = Hash.Parse(json['previousHash']);
        ab.height = json['height'];
        ab.momentumAcknowledged = HashHeight.FromJson(json['momentumAcknowledged']);
        ab.address = Address.Parse(json['address']);
        ab.toAddress = Address.Parse(json['toAddress']);
        ab.amount = json['amount'];
        ab.tokenStandard = TokenStandard.Parse(json['tokenStandard']);
        ab.fusedPlasma = json["fusedPlasma"];
        ab.data = Buffer.from(json['data'], 'base64');
        ab.difficulty = json['difficulty'];
        ab.nonce = Buffer.from(json['nonce'], 'hex');
        ab.publicKey = Buffer.from(json['publicKey'], 'base64');
        ab.signature = Buffer.from(json['signature'], 'base64');
        return ab;
    }

    static ContractCall(contractAddress, zts, amount, data) {
        const block = new AccountBlock()
        block.blockType = 2; // userSend
        block.toAddress = contractAddress;
        block.tokenStandard = zts;
        block.amount = amount;
        block.data = data
        return block
    }

    toJson() {
        return {
            version: this.version,
            blockType: this.blockType,
            fromBlockHash: this.fromBlockHash.toString('hex'),
            chainIdentifier: this.chainIdentifier,
            hash: this.hash.toString('hex'),
            previousHash: this.previousHash.toString('hex'),
            height: this.height,
            momentumAcknowledged: {
                hash: this.momentumAcknowledged.hash.toString('hex'),
                height: this.momentumAcknowledged.height,
            },
            address: this.address.toString(),
            toAddress: this.toAddress.toString(),
            amount: this.amount,
            tokenStandard: this.tokenStandard.toString(),
            fusedPlasma: this.fusedPlasma,
            data: this.data.toString('base64'),
            difficulty: this.difficulty,
            nonce: this.nonce.toString('hex'),
            publicKey: this.publicKey.toString('base64'),
            signature: this.signature.toString('base64'),
        }
    };

    getHash() {
        return Hash.Digest(
            Buffer.concat([
                longToBytes(this.version),
                longToBytes(this.chainIdentifier),
                longToBytes(this.blockType),
                this.previousHash.core,
                longToBytes(this.height),
                this.momentumAcknowledged.hash.core,
                longToBytes(this.momentumAcknowledged.height),
                this.address.core,
                this.toAddress.core,
                bigIntToBytes(this.amount),
                this.tokenStandard.core,
                this.fromBlockHash.core,
                Hash.Digest(Buffer.alloc(0)).core,
                Hash.Digest(this.data).core,
                longToBytes(this.fusedPlasma),
                longToBytes(this.difficulty),
                this.nonce
            ]));

    }
}

/*export default {
    AccountBlock
}*/
export {
    AccountBlock
}