import React, { createContext, useContext, useState, useEffect } from "react";

interface CompareContextType {
  selectedProperties: number[];
  addProperty: (id: number) => void;
  removeProperty: (id: number) => void;
  clearAll: () => void;
  isSelected: (id: number) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 3;
const STORAGE_KEY = "compare-properties";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<number[]>(() => {
    // Carregar do localStorage na inicialização
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Sincronizar com localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProperties));
    }
  }, [selectedProperties]);

  const addProperty = (id: number) => {
    setSelectedProperties((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const removeProperty = (id: number) => {
    setSelectedProperties((prev) => prev.filter((propId) => propId !== id));
  };

  const clearAll = () => {
    setSelectedProperties([]);
  };

  const isSelected = (id: number) => {
    return selectedProperties.includes(id);
  };

  const canAddMore = selectedProperties.length < MAX_COMPARE;

  return (
    <CompareContext.Provider
      value={{
        selectedProperties,
        addProperty,
        removeProperty,
        clearAll,
        isSelected,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
