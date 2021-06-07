import * as OracleSdk from '@keydonix/uniswap-oracle-sdk';
declare type JsonRpcObject = {
    jsonrpc: '2.0';
    id: number | string | null;
    method: string;
    params?: unknown[] | object;
};
declare type EthersProvider = {
    send: (method: string, params?: unknown[] | object) => Promise<unknown>;
};
declare type SendAsyncProvider = {
    sendAsync: (request: JsonRpcObject, callback: (error: unknown, result: unknown) => void) => Promise<unknown>;
};
declare type RequestProvider = {
    request: (method: string, params?: unknown[] | object) => Promise<unknown>;
};
declare type Provider = SendAsyncProvider | RequestProvider | EthersProvider;
export declare function getBlockByNumberFactory(provider: Provider): OracleSdk.EthGetBlockByNumber;
export declare function getStorageAtFactory(provider: Provider): OracleSdk.EthGetStorageAt;
export declare function getProofFactory(provider: Provider): OracleSdk.EthGetProof;
export declare class JsonRpcError extends Error {
    readonly code: number;
    readonly data?: unknown;
    constructor(code: number, message: string, data?: unknown);
}
export {};
//# sourceMappingURL=index.d.ts.map