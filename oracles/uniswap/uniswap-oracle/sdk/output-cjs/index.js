"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = exports.getProof = void 0;
const rlp_encoder_1 = require("./rlp-encoder");
const utils_1 = require("./utils");
async function getProof(eth_getStorageAt, eth_getProof, eth_getBlockByNumber, exchangeAddress, denominationToken, blockNumber) {
    const token0Address = await eth_getStorageAt(exchangeAddress, 6n, 'latest');
    const token1Address = await eth_getStorageAt(exchangeAddress, 7n, 'latest');
    if (denominationToken !== token0Address && denominationToken !== token1Address)
        throw new Error(`Denomination token ${utils_1.addressToString(denominationToken)} is not one of the two tokens for the Uniswap exchange at ${utils_1.addressToString(exchangeAddress)}`);
    const priceAccumulatorSlot = (denominationToken === token0Address) ? 10n : 9n;
    const proof = await eth_getProof(exchangeAddress, [8n, priceAccumulatorSlot], blockNumber);
    const block = await eth_getBlockByNumber(blockNumber);
    if (block === null)
        throw new Error(`Received null for block ${Number(blockNumber)}`);
    const blockRlp = rlpEncodeBlock(block);
    const accountProofNodesRlp = rlp_encoder_1.rlpEncode(proof.accountProof.map(rlp_encoder_1.rlpDecode));
    const reserveAndTimestampProofNodesRlp = rlp_encoder_1.rlpEncode(proof.storageProof[0].proof.map(rlp_encoder_1.rlpDecode));
    const priceAccumulatorProofNodesRlp = rlp_encoder_1.rlpEncode(proof.storageProof[1].proof.map(rlp_encoder_1.rlpDecode));
    return {
        block: blockRlp,
        accountProofNodesRlp,
        reserveAndTimestampProofNodesRlp,
        priceAccumulatorProofNodesRlp,
    };
}
exports.getProof = getProof;
// TODO: eth_getBlockByHash since we are making multiple calls in a row and the block at a particular number can change between calls
async function getPrice(eth_getStorageAt, eth_getBlockByNumber, exchangeAddress, denominationToken, blockNumber) {
    async function getAccumulatorValue(innerBlockNumber, timestamp) {
        const token0 = await eth_getStorageAt(exchangeAddress, 6n, innerBlockNumber);
        const token1 = await eth_getStorageAt(exchangeAddress, 7n, innerBlockNumber);
        const reservesAndTimestamp = await eth_getStorageAt(exchangeAddress, 8n, innerBlockNumber);
        const accumulator0 = await eth_getStorageAt(exchangeAddress, 9n, innerBlockNumber);
        const accumulator1 = await eth_getStorageAt(exchangeAddress, 10n, innerBlockNumber);
        const blockTimestampLast = reservesAndTimestamp >> (112n + 112n);
        const reserve1 = (reservesAndTimestamp >> 112n) & (2n ** 112n - 1n);
        const reserve0 = reservesAndTimestamp & (2n ** 112n - 1n);
        if (token0 !== denominationToken && token1 !== denominationToken)
            throw new Error(`Denomination token ${utils_1.addressToString(denominationToken)} is not one of the tokens for exchange ${exchangeAddress}`);
        if (reserve0 === 0n)
            throw new Error(`Exchange ${utils_1.addressToString(exchangeAddress)} does not have any reserves for token0.`);
        if (reserve1 === 0n)
            throw new Error(`Exchange ${utils_1.addressToString(exchangeAddress)} does not have any reserves for token1.`);
        if (blockTimestampLast === 0n)
            throw new Error(`Exchange ${utils_1.addressToString(exchangeAddress)} has not had its first accumulator update (or it is year 2106).`);
        if (accumulator0 === 0n)
            throw new Error(`Exchange ${utils_1.addressToString(exchangeAddress)} has not had its first accumulator update (or it is 136 years since launch).`);
        if (accumulator1 === 0n)
            throw new Error(`Exchange ${utils_1.addressToString(exchangeAddress)} has not had its first accumulator update (or it is 136 years since launch).`);
        const numeratorReserve = (token0 === denominationToken) ? reserve0 : reserve1;
        const denominatorReserve = (token0 === denominationToken) ? reserve1 : reserve0;
        const accumulator = (token0 === denominationToken) ? accumulator1 : accumulator0;
        const timeElapsedSinceLastAccumulatorUpdate = timestamp - blockTimestampLast;
        const priceNow = numeratorReserve * 2n ** 112n / denominatorReserve;
        return accumulator + timeElapsedSinceLastAccumulatorUpdate * priceNow;
    }
    const latestBlock = await eth_getBlockByNumber('latest');
    if (latestBlock === null)
        throw new Error(`Block 'latest' does not exist.`);
    const historicBlock = await eth_getBlockByNumber(blockNumber);
    if (historicBlock === null)
        throw new Error(`Block ${blockNumber} does not exist.`);
    const latestAccumulator = await getAccumulatorValue(latestBlock.number, latestBlock.timestamp);
    const historicAccumulator = await getAccumulatorValue(blockNumber, historicBlock.timestamp);
    const accumulatorDelta = latestAccumulator - historicAccumulator;
    const timeDelta = latestBlock.timestamp - historicBlock.timestamp;
    return accumulatorDelta / timeDelta;
}
exports.getPrice = getPrice;
function rlpEncodeBlock(block) {
    return rlp_encoder_1.rlpEncode([
        utils_1.unsignedIntegerToUint8Array(block.parentHash, 32),
        utils_1.unsignedIntegerToUint8Array(block.sha3Uncles, 32),
        utils_1.unsignedIntegerToUint8Array(block.miner, 20),
        utils_1.unsignedIntegerToUint8Array(block.stateRoot, 32),
        utils_1.unsignedIntegerToUint8Array(block.transactionsRoot, 32),
        utils_1.unsignedIntegerToUint8Array(block.receiptsRoot, 32),
        utils_1.unsignedIntegerToUint8Array(block.logsBloom, 256),
        utils_1.stripLeadingZeros(utils_1.unsignedIntegerToUint8Array(block.difficulty, 32)),
        utils_1.stripLeadingZeros(utils_1.unsignedIntegerToUint8Array(block.number, 32)),
        utils_1.stripLeadingZeros(utils_1.unsignedIntegerToUint8Array(block.gasLimit, 32)),
        utils_1.stripLeadingZeros(utils_1.unsignedIntegerToUint8Array(block.gasUsed, 32)),
        utils_1.stripLeadingZeros(utils_1.unsignedIntegerToUint8Array(block.timestamp, 32)),
        utils_1.stripLeadingZeros(block.extraData),
        ...(block.mixHash !== undefined ? [utils_1.unsignedIntegerToUint8Array(block.mixHash, 32)] : []),
        ...(block.nonce !== null && block.nonce !== undefined ? [utils_1.unsignedIntegerToUint8Array(block.nonce, 8)] : []),
    ]);
}
//# sourceMappingURL=index.js.map