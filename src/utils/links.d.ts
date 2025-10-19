export type BuildTrackedLinkOptions = {
  path: string;
  slot: string;
  camp: string;
  placeholder: string;
};

export declare const isPagesBuild: () => boolean;
export declare const withBase: (path?: string) => string;
export declare const buildTrackedLink: (options: BuildTrackedLinkOptions) => string;
export declare const formatDateStamp: () => string;
export declare const getClaimUrl: () => string;
