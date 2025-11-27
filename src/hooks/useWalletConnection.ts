import { useState, useCallback } from "react";
import { generateMockAddress } from "../utils/wallet";

type WalletStatus = "disconnected" | "connecting" | "connected";

interface UseWalletConnectionReturn {
  walletAddress: string | null;
  isConnected: boolean;
  status: WalletStatus;
  connect: () => void;
  disconnect: () => void;
}

const STORAGE_KEY = "wallet_address";

/**
 * Hook for managing mock wallet connection state
 * Persists wallet address in localStorage
 */
export const useWalletConnection = (): UseWalletConnectionReturn => {
  // Lazy initialization from localStorage
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const [status, setStatus] = useState<WalletStatus>(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEY);
    return savedAddress ? "connected" : "disconnected";
  });

  // Connect wallet - generates random address
  const connect = useCallback(() => {
    setStatus("connecting");

    // Simulate connection delay
    setTimeout(() => {
      const newAddress = generateMockAddress();
      setWalletAddress(newAddress);
      setStatus("connected");
      localStorage.setItem(STORAGE_KEY, newAddress);
    }, 500);
  }, []);

  // Disconnect wallet - clears state and localStorage
  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setStatus("disconnected");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    walletAddress,
    isConnected: status === "connected",
    status,
    connect,
    disconnect,
  };
};
