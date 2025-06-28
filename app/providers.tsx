"use client";

import { Provider } from 'react-redux';
import { Toaster } from "sonner";
import { store } from "./store/store";
import NotificationManager from "./components/NotificationManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <NotificationManager />
      <Toaster richColors position="top-right" />
    </Provider>
  );
}
