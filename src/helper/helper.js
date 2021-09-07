/**
 *
 * @param {"SHA-1"|"SHA-256"|"SHA-384"|"SHA-512"} algorithm
 * @param {string|Blob} value
 * @returns converts the ArrayBuffer to a hex string
 */
export const getHash = async (algorithm, value) => {
    'use strict'
    const main = async (msgUint8) => {
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }

    if (value instanceof Blob) {
        const arrayBuffer = await value.arrayBuffer()
        const msgUint8 = new Uint8Array(arrayBuffer)

        return await main(msgUint8)
    }

    const msgUint8 = new TextEncoder().encode(value);                           // encode as (utf-8) Uint8Array
    return await main(msgUint8)
}