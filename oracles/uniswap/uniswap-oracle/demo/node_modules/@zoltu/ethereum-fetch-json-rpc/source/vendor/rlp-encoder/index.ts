export type RlpItem = Uint8Array | RlpItemArray
export interface RlpItemArray extends Array<RlpItem> {}

export function rlpEncode(item: RlpItem): Uint8Array {
	if (item instanceof Uint8Array) {
		return rlpEncodeItem(item)
	} else if (Array.isArray(item)) {
		return rlpEncodeList(item)
	} else {
		throw new Error(`Can only RLP encode Uint8Arrays (items) and arrays (lists).  Please encode your item into a Uint8Array first.\nType: ${typeof item}\n${item}`)
	}
}

function rlpEncodeItem(data: Uint8Array): Uint8Array {
	if (data.length === 1 && data[0] < 0x80) return rlpEncodeTiny(data)
	else if (data.length <= 55) return rlpEncodeSmall(data)
	else return rlpEncodeLarge(data)
}

function rlpEncodeList(items: Array<RlpItem>): Uint8Array {
	const encodedItems = items.map(rlpEncode)
	const encodedItemsLength = encodedItems.reduce((total, item) => total + item.length, 0)
	if (encodedItemsLength <= 55) {
		const result = new Uint8Array(encodedItemsLength + 1)
		result[0] = 0xc0 + encodedItemsLength
		let offset = 1
		for (let encodedItem of encodedItems) {
			result.set(encodedItem, offset)
			offset += encodedItem.length
		}
		return result
	} else {
		const lengthBytes = hexStringToUint8Array(encodedItemsLength.toString(16))
		const result = new Uint8Array(1 + lengthBytes.length + encodedItemsLength)
		result[0] = 0xf7 + lengthBytes.length
		result.set(lengthBytes, 1)
		let offset = 1 + lengthBytes.length
		for (let encodedItem of encodedItems) {
			result.set(encodedItem, offset)
			offset += encodedItem.length
		}
		return result
	}
}

function rlpEncodeTiny(data: Uint8Array): Uint8Array {
	if (data.length > 1) throw new Error(`rlpEncodeTiny can only encode single byte values.`)
	if (data[0] > 0x80) throw new Error(`rlpEncodeTiny can only encode values less than 0x80`)
	return data
}

function rlpEncodeSmall(data: Uint8Array): Uint8Array {
	if (data.length === 1 && data[0] < 0x80) throw new Error(`rlpEncodeSmall can only encode data that is longer than 1 byte or has a value >= 0x7f`)
	if (data.length > 55) throw new Error(`rlpEncodeSmall can only encode data that is <= 55 bytes long`)
	const result = new Uint8Array(data.length + 1)
	result[0] = 0x80 + data.length
	result.set(data, 1)
	return result
}

function rlpEncodeLarge(data: Uint8Array): Uint8Array {
	if (data.length <= 55) throw new Error(`rlpEncodeLarge can only encode data that is > 55 bytes long`)
	const lengthBytes = hexStringToUint8Array(data.length.toString(16))
	const result = new Uint8Array(data.length + lengthBytes.length + 1)
	result[0] = 0xb7 + lengthBytes.length
	result.set(lengthBytes, 1)
	result.set(data, 1 + lengthBytes.length)
	return result
}

function hexStringToUint8Array(hex: string): Uint8Array {
	const match = new RegExp(`^(?:0x)?([a-fA-F0-9]*)$`).exec(hex)
	if (match === null) throw new Error(`Expected a hex string encoded byte array with an optional '0x' prefix but received ${hex}`)
	const maybeLeadingZero = (match[1].length % 2) ? '0' : ''
	const normalized = `${maybeLeadingZero}${match[1]}`
	const byteLength = normalized.length / 2
	const bytes = new Uint8Array(byteLength)
	for (let i = 0; i < byteLength; ++i) {
		bytes[i] = (Number.parseInt(`${normalized[i*2]}${normalized[i*2+1]}`, 16))
	}
	return bytes
}
