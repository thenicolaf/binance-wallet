/**
 * Generates a random mock Ethereum-style wallet address
 * @returns Address in format 0x + 40 hex characters
 */
export const generateMockAddress = (): string => {
  const hexChars = "0123456789abcdef";
  let address = "0x";

  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * hexChars.length)];
  }

  return address;
};

/**
 * Truncates a wallet address to show first 6 and last 4 characters
 * @param address - Full wallet address
 * @returns Truncated address in format 0xAbC...1234
 */
export const truncateAddress = (address: string): string => {
  if (!address || address.length < 10) return address;

  const start = address.slice(0, 6); // 0xAbCD
  const end = address.slice(-4); // last 4 chars

  return `${start}...${end}`;
};
