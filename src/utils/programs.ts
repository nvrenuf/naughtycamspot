import type { ProgramStatus } from '../data/programStatus';

type ProgramRecord = {
  key?: string;
  join_base?: string;
  subid_params?: string[];
  status?: ProgramStatus | (string & {});
};

type TrackingInput =
  | string
  | {
      slot?: string;
      src?: string;
      camp?: string;
      date?: string;
    };

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const sanitizeParams = (params: string[] | undefined) =>
  (params ?? [])
    .map((param) => param.trim())
    .filter((param) => param.length > 0);

const safeEncode = (value: string) => encodeURIComponent(value.trim());

export const isProgramApproved = (program?: ProgramRecord | null): boolean =>
  !!program && program.status === 'approved';

export const buildPagesJoinHref = (
  program: ProgramRecord | undefined,
  tracking: TrackingInput
): string => {
  if (!program || typeof program.join_base !== 'string') {
    return '';
  }

  const baseHref = program.join_base.trim();
  if (!baseHref) {
    return '';
  }

  const slot = typeof tracking === 'string' ? tracking.trim() : (tracking.slot ?? '').trim();
  const src = typeof tracking === 'string' ? slot : (tracking.src ?? slot).trim();
  const camp = typeof tracking === 'string' ? '' : (tracking.camp ?? '').trim();
  const date = typeof tracking === 'string' ? '' : (tracking.date ?? '').trim();
  const params = sanitizeParams(program.subid_params);

  const subidValue = [src, camp, date].filter(Boolean).join('-') || slot;

  if (!slot || params.length === 0) {
    return baseHref;
  }

  if (isHttpUrl(baseHref)) {
    try {
      const url = new URL(baseHref);
      params.forEach((param) => {
        url.searchParams.set(param, subidValue);
      });
      return url.toString();
    } catch (error) {
      // Fall back to manual concatenation below.
    }
  }

  const glue = baseHref.includes('?') ? '&' : '?';
  const query = params
    .map((param) => `${safeEncode(param)}=${safeEncode(subidValue)}`)
    .join('&');

  return `${baseHref}${glue}${query}`;
};

export const allowsPagesJoin = (program?: ProgramRecord | null): boolean => {
  if (!isProgramApproved(program)) {
    return false;
  }

  const baseHref = typeof program?.join_base === 'string' ? program.join_base.trim() : '';
  return isHttpUrl(baseHref);
};

