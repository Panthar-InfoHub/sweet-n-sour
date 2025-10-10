"use client";
import { MediaSection } from "@/components/admin/shared/media-section";
import React, { useState } from "react";

const page = () => {
  const [media, setMedia] = useState<string[]>([]);

  return (
    <div>
      <MediaSection media={media} onChange={setMedia} maxFiles={8} />
    </div>
  );
};

export default page;
