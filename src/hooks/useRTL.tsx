import { createContext, ReactNode, useContext, useState } from 'react';

interface RTLContextType {
  isRTL: boolean;
  toggleRTL: () => void;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export const RTLProvider = ({ children }: { children: ReactNode }) => {
  const [isRTL, setIsRTL] = useState(false);
  const toggleRTL = () => setIsRTL((prev) => !prev);

  return (
    <RTLContext.Provider value={{ isRTL, toggleRTL }}>
      {children}
    </RTLContext.Provider>
  );
};

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within RTLProvider');
  }
  return context;
};
