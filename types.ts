
export interface VideoMaterial {
  id: string;
  month: string;
  category: string;
  type: string;
  cover: string;
  videoUrl: string;
  sellingPoints: string[];
  hookAnalysis: string;
  scripts: string[];
}

export interface DistributionItem {
  name: string;
  value: number;
}

export interface SummaryStats {
  monthDist: DistributionItem[];
  categoryDist: DistributionItem[];
  typeDist: DistributionItem[];
}
