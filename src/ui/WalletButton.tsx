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

  const getButtonClass = () => {
    if (status === "connecting") {
      return "bg-ui-wallet opacity-70";
    }
    if (isConnected) {
      return "bg-trading-long";
    }
    return "bg-ui-wallet hover:bg-ui-wallet-hover";
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "connecting"}
      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all text-ui-text-primary disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass()}`}
    >
      {getButtonText()}
    </button>
  );
};
