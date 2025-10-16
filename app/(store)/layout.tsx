import { AnnouncementBar } from "@/components/store/common/announcement-bar";
import { Footer } from "@/components/store/common/footer";
import { Header } from "@/components/store/common/header";
import "./styless.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider forcedTheme="light" attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-brand-background">
        <AnnouncementBar />
        <Header />
        <main className="flex-grow flex-1  ">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
