import { AnnouncementBar } from "@/components/store/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow flex-1 ">{children}</main>
      <Footer />
    </div>
  );
}
