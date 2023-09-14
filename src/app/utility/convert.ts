export function byteToHex(byte: number): string {
    return (byte & 0xFF).toString(16).padStart(2, '0').toUpperCase();
}

export function isValidHexString(input: string): boolean {
    return typeof input === 'string'
    && input.length > 0
    && input.length % 2 === 0
    && !input.match(/[^A-Fa-f0-9]/);
}

export function hexToDataView(hex: string): DataView {
    const {buffer} = Uint8Array.from(hexToBytes(hex));
    return new DataView(buffer);
}

export function hexToBytes(hex: string): number[] {

    hex = hex || '';
    const matchResult = hex.match(/.{2}/g);

    if (!matchResult) {
        return [];
    }

    return Array.from(matchResult!)
        .map(v => parseInt(v, 16));
}