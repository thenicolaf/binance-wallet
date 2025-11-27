import { Bitcoin, ChevronDown } from "lucide-react";

export const TokenSelector = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Token info with icon */}
      <div className="flex items-center gap-3">
        {/* Bitcoin icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F7931A]">
          <Bitcoin className="w-6 h-6 text-white" />
        </div>

        {/* Token name and leverage */}
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-ui-text-primary">
            BTCDEGEN/USDC
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-background-card text-ui-text-secondary">
            100x
          </span>

          {/* Dropdown arrow */}
          <ChevronDown className="w-3 h-3 text-ui-text-secondary" />
        </div>
      </div>
    </div>
  );
};
