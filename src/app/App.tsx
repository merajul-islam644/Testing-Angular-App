import { AppProviders } from "./providers/AppProviders";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AppRouter } from "./router/routes";

export function App() {
  return (
    <AppProviders>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </AppProviders>
  );
}
