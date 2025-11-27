import { Gift, TrendingUp, Award, User } from "lucide-react";

type NavTab = "trade" | "positions" | "rewards" | "profile";

export const BottomNavigation = () => {
  const activeTab: NavTab = "trade";

  const tabs = [
    {
      id: "trade" as NavTab,
      label: "Trade",
      icon: <Gift className="w-6 h-6" />,
    },
    {
      id: "positions" as NavTab,
      label: "Positions",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: "rewards" as NavTab,
      label: "Rewards",
      badge: "345,29k",
      icon: <Award className="w-6 h-6" />,
    },
    {
      id: "profile" as NavTab,
      label: "Profile",
      icon: <User className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="border-t bg-background-primary border-ui-border">
      <div className="flex justify-around items-center px-4 pt-2 pb-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center gap-1 min-w-[60px] relative ${
                isActive ? "text-accent-gold" : "text-ui-text-secondary"
              }`}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>

              {/* Badge for Rewards tab */}
              {tab.badge && (
                <span className="absolute -top-1 right-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-trading-short text-ui-text-primary">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* iOS home indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 rounded-full bg-ui-text-secondary opacity-30" />
      </div>
    </nav>
  );
};
