export interface IWallet {
    baseAddress?: string;
    crypto?: {
        argon2Params: {
            salt: string;
        };
        cipherData: string;
        cipherName: string;
        kdf: string;
        nonce: string;
    };
    timestamp?: number;
    version?: number;
    getKeyPair?(number);
}

interface IToken {
    name: string;
    symbol: string;
    domain: string;
    totalSupply: number;
    decimals: number;
    owner: string;
    tokenStandard: string;
    maxSupply: number;
    isBurnable: boolean;
    isMintable: boolean;
    isUtility: boolean;
}

export interface IAccountInfo {
    address: string;
    accountHeight: number;
    balanceInfoMap: Map<string, IBalanceInfo>
}

export interface IBalanceInfo {
    token: IToken;
    balance: number;
}

export interface IMomentum {
    version: number;
    chainIdentifier: number;
    hash: string;
    previousHash: string;
    height: number;
    timestamp: number;
    data: string;
    content: {
        address: string;
        hash: string;
        height: number;
    };
    changesHash?: string;
    publicKey: string;
    signature: string;
    producer: string;

}

export interface ITransaction {
    sender: string;
    receiver: string;
    amount: number;
    token: string;
    hash: string | Buffer;
    confirmationTimestampUTC: string;
    blockHeight: number;
    direction: string;
}

export interface IUnreceivedBlocks {
    list: IAccountBlock[];
    count: number;
    more: boolean;
}

export interface IAccountBlock {
    version: number;
    chainIdentifier: number;
    blockType: number;
    hash: string | Buffer;
    previousHash: string | Buffer;
    height: number;
    momentumAcknowledged: IHashHeight;
    address: string;
    toAddress: string;
    amount: number;
    tokenStandard: string;
    fromBlockHash: string | Buffer;
    descendantBlocks?: IAccountBlock[];
    data: string;
    fusedPlasma: number;
    difficulty: number;
    nonce: string;
    basePlasma?: number;
    usedPlasma?: number;
    changesHash?: string | Buffer;
    publicKey: string | Buffer;
    signature: string | null;
    token?: IToken;
    confirmationDetail?: {
        numConfirmations: number;
        momentumHeight: number;
        momentumHash: string;
        momentumTimestamp: number;
    };
    pairedAccountBlock?: IAccountBlock;
    getHash();
    toJson();
}

export interface IHashHeight {
    height: number;
    hash: string;
}

export interface IAddress {
    toString();
    Parse(string);
    FromHex(string);
}