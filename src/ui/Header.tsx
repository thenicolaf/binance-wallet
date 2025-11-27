import { MoreHorizontal, X } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background-primary">
      {/* Left: Menu icon */}
      <button
        className="p-2 hover:opacity-80 transition-opacity"
        aria-label="Menu"
      >
        <MoreHorizontal className="w-5 h-5 text-ui-text-secondary" />
      </button>

      {/* Center: Title */}
      <h1 className="text-lg font-semibold text-ui-text-primary">
        Mini App
      </h1>

      {/* Right: Close button */}
      <button
        className="p-2 hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-ui-text-secondary" />
      </button>
    </header>
  );
};
