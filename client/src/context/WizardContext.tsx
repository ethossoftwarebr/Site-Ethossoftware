import { createContext, useContext, useState } from "react";

interface WizardContextType {
  isOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
}

const WizardContext = createContext<WizardContextType>({
  isOpen: false,
  openWizard: () => {},
  closeWizard: () => {},
});

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WizardContext.Provider value={{ isOpen, openWizard: () => setIsOpen(true), closeWizard: () => setIsOpen(false) }}>
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);
