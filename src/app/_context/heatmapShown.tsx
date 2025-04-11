import { type ReactNode, createContext, useContext, useState } from "react";

type HeatmapContextType = {
  heatmapShown: boolean;
  setHeatmapShow: (show: boolean) => void;
};

const HeatmapContext = createContext<HeatmapContextType | undefined>(undefined);

export function HeatmapProvider({ children }: { children: ReactNode }) {
  const [heatmapShown, setHeatmapShow] = useState(false);

  return (
    <HeatmapContext.Provider value={{ heatmapShown, setHeatmapShow }}>
      {children}
    </HeatmapContext.Provider>
  );
}

export function useHeatmap() {
  const context = useContext(HeatmapContext);
  if (context === undefined) {
    throw new Error("useHeatmap must be used within a HeatmapProvider");
  }
  return context;
}
