export interface Proof {
    readonly block: Uint8Array;
    readonly accountProofNodesRlp: Uint8Array;
    readonly reserveAndTimestampProofNodesRlp: Uint8Array;
    readonly priceAccumulatorProofNodesRlp: Uint8Array;
}
export declare type ProofResult = {
    readonly accountProof: readonly Uint8Array[];
    readonly storageProof: readonly {
        readonly key: bigint;
        readonly value: bigint;
        readonly proof: readonly Uint8Array[];
    }[];
};
export declare type Block = {
    readonly parentHash: bigint;
    readonly sha3Uncles: bigint;
    readonly miner: bigint;
    readonly stateRoot: bigint;
    readonly transactionsRoot: bigint;
    readonly receiptsRoot: bigint;
    readonly logsBloom: bigint;
    readonly difficulty: bigint;
    readonly number: bigint;
    readonly gasLimit: bigint;
    readonly gasUsed: bigint;
    readonly timestamp: bigint;
    readonly extraData: Uint8Array;
    readonly mixHash: bigint | undefined;
    readonly nonce: bigint | null;
};
export declare type EthGetStorageAt = (address: bigint, position: bigint, block: bigint | 'latest') => Promise<bigint>;
export declare type EthGetProof = (address: bigint, positions: readonly bigint[], block: bigint) => Promise<ProofResult>;
export declare type EthGetBlockByNumber = (blockNumber: bigint | 'latest') => Promise<Block | null>;
export declare function getProof(eth_getStorageAt: EthGetStorageAt, eth_getProof: EthGetProof, eth_getBlockByNumber: EthGetBlockByNumber, exchangeAddress: bigint, denominationToken: bigint, blockNumber: bigint): Promise<Proof>;
export declare function getPrice(eth_getStorageAt: EthGetStorageAt, eth_getBlockByNumber: EthGetBlockByNumber, exchangeAddress: bigint, denominationToken: bigint, blockNumber: bigint): Promise<bigint>;
//# sourceMappingURL=index.d.ts.map