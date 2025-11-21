import type { ProgramStatus } from "../data/programStatus";

export type ProgramRecord = {
  key?: string;
  join_base?: string;
  subid_params?: string[];
  status?: ProgramStatus | (string & {});
};

export type TrackingInput =
  | string
  | {
      slot?: string;
      src?: string;
      camp?: string;
      date?: string;
    };

export { allowsPagesJoin, buildPagesJoinHref, isProgramApproved } from "./programs.js";
