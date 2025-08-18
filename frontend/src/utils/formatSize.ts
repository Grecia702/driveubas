export function formatBytes(byte: number) {
    if (byte === 0) return '0 B'
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(byte) / Math.log(1024))
    const value = byte / Math.pow(1024, i)
    return `${value.toFixed(2)} ${sizes[i]}`
}