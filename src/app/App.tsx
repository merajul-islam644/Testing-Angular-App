import { AppProviders } from "./providers/AppProviders";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "../shared/ui/Toast";
import { AppRouter } from "./router/routes";

export function App() {
  return (
    <AppProviders>
      <ThemeProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ThemeProvider>
    </AppProviders>
  );
}