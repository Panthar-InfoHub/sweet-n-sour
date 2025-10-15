import { getSiteConfig } from "@/actions/admin/site-config.actions";
import { Suspense } from "react";

export async function AnnouncementBar() {
  return (
    <Suspense fallback={null}>
      <BarContent />
    </Suspense>
  );
}

const BarContent = async () => {
  const configResult = await getSiteConfig();

  if (!configResult.success || !configResult.data || !configResult.data.showAnnouncementBar) {
    return null;
  }

  const { announcementText } = configResult.data;

  return (
    <div className="bg-brand-background text-brand-primary py-3 px-4 text-center text-sm font-semibold">
      {announcementText}
    </div>
  );
};
