import { useWalletConnection } from "../hooks/useWalletConnection";
import { truncateAddress } from "../utils/wallet";

export const WalletButton = () => {
  const { walletAddress, isConnected, status, connect, disconnect } =
    useWalletConnection();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const getButtonText = () => {
    if (status === "connecting") return "Connecting...";
    if (isConnected && walletAddress) return truncateAddress(walletAddress);
    return "Connect Wallet";
  };

  const getButtonColor = () => {
    if (status === "connecting") return "bg-yellow-700 hover:bg-yellow-800";
    if (isConnected) return "bg-green-700 hover:bg-green-800";
    return "bg-yellow-600 hover:bg-yellow-700";
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "connecting"}
      className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {getButtonText()}
    </button>
  );
};
