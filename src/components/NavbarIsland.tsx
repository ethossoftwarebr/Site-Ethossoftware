import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

// Thin wrapper: provides ThemeContext for ThemeToggle (Navbar's child).
// Footer doesn't consume useTheme, so no wrapper needed there.
export default function NavbarIsland() {
  return (
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}
