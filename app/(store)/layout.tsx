import { AnnouncementBar } from "@/components/store/common/announcement-bar";
import { Footer } from "@/components/store/common/footer";
import { Header } from "@/components/store/common/header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow flex-1  ">{children}</main>
      <Footer />
    </div>
  );
}
