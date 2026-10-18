export type Source = { title: string; url: string };
export type Activity = {
  id: string; name: string; originalName: string; city: string; category: string;
  reportSection: string; summary: string; area: string; reportDetails: Record<string,string>;
  reportSources: Source[]; researchStatus: string;
};
export type Research = {
  id: string; researchedAt: string; status: 'verified' | 'partial' | 'unavailable';
  summary: string; whyGo: string[]; bestFor: string[]; skipIf: string[];
  duration: string; cost: string; hours: string; bestTime: string;
  gettingThere: string; booking: string; accessibility: string;
  practicalTips: string[]; decemberNotes: string; uncertainties: string[];
  sources: Source[];
  images: { url: string; sourceUrl: string; alt: string; credit: string; license: string }[];
};
