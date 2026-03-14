import React, { createContext, useContext, useState, useCallback } from "react";

type WidgetScreen = "menu" | "ai_chat" | "sav" | "callback";

interface ContactWidgetContextType {
  isOpen: boolean;
  screen: WidgetScreen;
  openWidget: () => void;
  closeWidget: () => void;
  setScreen: (screen: WidgetScreen) => void;
}

const ContactWidgetContext = createContext<ContactWidgetContextType | undefined>(undefined);

export const ContactWidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreenState] = useState<WidgetScreen>("menu");

  const openWidget = useCallback(() => setIsOpen(true), []);
  const closeWidget = useCallback(() => setIsOpen(false), []);
  const setScreen = useCallback((s: WidgetScreen) => setScreenState(s), []);

  return (
    <ContactWidgetContext.Provider value={{ isOpen, screen, openWidget, closeWidget, setScreen }}>
      {children}
    </ContactWidgetContext.Provider>
  );
};

export const useContactWidget = () => {
  const ctx = useContext(ContactWidgetContext);
  if (!ctx) throw new Error("useContactWidget must be used within ContactWidgetProvider");
  return ctx;
};
