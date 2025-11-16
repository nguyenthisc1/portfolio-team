export function hexToRgbArray(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '')
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((x) => x + x)
            .join('')
    }
    const num = parseInt(hex, 16)
    return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}
