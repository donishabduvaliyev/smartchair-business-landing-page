import { createContext, useContext, useState, type ReactNode } from "react";

interface PartnerModalContextValue {
  isOpen: boolean;
  openPartnerModal: () => void;
  closePartnerModal: () => void;
}

const PartnerModalContext = createContext<PartnerModalContextValue | null>(null);

export function PartnerModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPartnerModal = () => setIsOpen(true);
  const closePartnerModal = () => setIsOpen(false);

  return (
    <PartnerModalContext.Provider value={{ isOpen, openPartnerModal, closePartnerModal }}>
      {children}
    </PartnerModalContext.Provider>
  );
}

export function usePartnerModal(): PartnerModalContextValue {
  const ctx = useContext(PartnerModalContext);
  if (!ctx) {
    throw new Error("usePartnerModal must be used within a PartnerModalProvider");
  }
  return ctx;
}
