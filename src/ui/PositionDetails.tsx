import { ChevronDown } from "lucide-react";

export const PositionDetails = () => {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-background-card">
        {/* Position details label */}
        <span className="text-sm text-ui-text-secondary">
          Position details
        </span>

        {/* Margin and Leverage info */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-ui-text-primary">
            Margin $10
          </span>
          <span className="text-sm font-medium text-ui-text-primary">
            Leverage 10x
          </span>

          {/* Dropdown arrow */}
          <ChevronDown className="w-3 h-3 ml-1 text-ui-text-secondary" />
        </div>
      </div>
    </div>
  );
};
