import { createContext, useContext, useState } from "react";

const CurrentBoundsContext = createContext();

export function CurrentBoundsProvider({ children }) {
  const [currentBounds, setCurrentBounds] = useState(null);

  return (
    <CurrentBoundsContext.Provider value={{ currentBounds, setCurrentBounds }}>
      {children}
    </CurrentBoundsContext.Provider>
  );
}

export function useCurrentBounds() {
  return useContext(CurrentBoundsContext);
}
