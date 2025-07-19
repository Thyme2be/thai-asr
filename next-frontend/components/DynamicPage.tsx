"use client";

import DynamicCard from "@/components/DynamicCard";
import Transcript from "@/components/Transcript";
import { DynamicCardProps } from "@/types/props";
import { useState } from "react";

interface DynamicPageProps extends Pick<DynamicCardProps, "cardType"> {}

const DynamicPage = ({ cardType }: DynamicPageProps) => {
  const [transcriptText, setTranscriptText] = useState<string | null>(null);

  return (
    <>
      <DynamicCard cardType={cardType} transcribeText={setTranscriptText} />
      <Transcript transcribeText={transcriptText} />
    </>
  );
};

export default DynamicPage;
