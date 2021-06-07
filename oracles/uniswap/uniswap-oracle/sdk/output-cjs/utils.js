"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsignedIntegerToUint8Array = exports.stripLeadingZeros = exports.addressToString = void 0;
function addressToString(value) {
    return `0x${value.toString(16).padStart(40, '0')}`;
}
exports.addressToString = addressToString;
function stripLeadingZeros(byteArray) {
    let i = 0;
    for (; i < byteArray.length; ++i) {
        if (byteArray[i] !== 0)
            break;
    }
    const result = new Uint8Array(byteArray.length - i);
    for (let j = 0; j < result.length; ++j) {
        result[j] = byteArray[i + j];
    }
    return result;
}
exports.stripLeadingZeros = stripLeadingZeros;
function unsignedIntegerToUint8Array(value, widthInBytes = 32) {
    if (typeof value === 'number') {
        if (!Number.isSafeInteger(value))
            throw new Error(`${value} is not able to safely be cast into a bigint.`);
        value = BigInt(value);
    }
    if (value >= 2n ** (BigInt(widthInBytes) * 8n) || value < 0n)
        throw new Error(`Cannot fit ${value} into a ${widthInBytes * 8}-bit unsigned integer.`);
    const result = new Uint8Array(widthInBytes);
    if (result.length !== widthInBytes)
        throw new Error(`Cannot a ${widthInBytes} value into a ${result.length} byte array.`);
    for (let i = 0; i < result.length; ++i) {
        result[i] = Number((value >> BigInt((widthInBytes - i) * 8 - 8)) & 0xffn);
    }
    return result;
}
exports.unsignedIntegerToUint8Array = unsignedIntegerToUint8Array;
//# sourceMappingURL=utils.js.map