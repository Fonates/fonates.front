export const sliceWalletAddress = (addr: string, len: number) => {
    const lenAddr = addr.length;
    return addr.slice(0, len) + '...' + addr.slice(lenAddr - len, lenAddr);
};