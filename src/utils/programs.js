const isHttpUrl = (value) => /^https?:\/\//i.test(value);

const sanitizeParams = (params) =>
  (params ?? [])
    .map((param) => param.trim())
    .filter((param, index, all) => param.length > 0 && all.indexOf(param) === index);

const safeEncode = (value) => encodeURIComponent(value.trim());

export const isProgramApproved = (program = undefined) => !!program && program.status === 'approved';

const resolveEnvValue = (name) => {
  if (typeof process !== 'undefined' && typeof process.env?.[name] === 'string') {
    return process.env[name];
  }
  if (typeof import.meta !== 'undefined' && typeof import.meta?.env?.[name] === 'string') {
    return import.meta.env[name];
  }
  return '';
};

const resolveProgramConfig = (program = {}) => {
  const key = (program.key ?? '').trim();
  const envKey = key ? key.toUpperCase().replace(/[^A-Z0-9]/g, '_') : '';
  const overrideJoinBase = envKey ? resolveEnvValue(`NCS_${envKey}_JOIN_BASE`) : '';
  const overrideSubidsRaw = envKey ? resolveEnvValue(`NCS_${envKey}_SUBIDS`) : '';

  const join_base = (overrideJoinBase || program.join_base || '').trim();
  const subid_params = sanitizeParams(
    overrideSubidsRaw
      ? overrideSubidsRaw.split(',')
      : Array.isArray(program?.subid_params)
        ? program.subid_params
        : []
  );

  return { key, join_base, subid_params };
};

const isBlockedJoinPath = (href) => /\/go\//i.test(href);

export const buildPagesJoinHref = (program, tracking) => {
  const resolved = resolveProgramConfig(program);

  if (!resolved.join_base) {
    return '';
  }

  const baseHref = resolved.join_base.trim();
  if (!isHttpUrl(baseHref) || isBlockedJoinPath(baseHref)) {
    return '';
  }

  const slot = typeof tracking === 'string' ? tracking.trim() : (tracking.slot ?? '').trim();
  const src = typeof tracking === 'string' ? slot : (tracking.src ?? slot).trim();
  const camp = typeof tracking === 'string' ? '' : (tracking.camp ?? '').trim();
  const date = typeof tracking === 'string' ? '' : (tracking.date ?? '').trim();
  const params = resolved.subid_params;

  const subidValue = [src, camp, date].filter(Boolean).join('|') || slot;

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
      // fall through to manual concatenation
    }
  }

  const glue = baseHref.includes('?') ? '&' : '?';
  const query = params.map((param) => `${safeEncode(param)}=${safeEncode(subidValue)}`).join('&');

  return `${baseHref}${glue}${query}`;
};

export const allowsPagesJoin = (program) => {
  if (!isProgramApproved(program)) {
    return false;
  }

  const resolved = resolveProgramConfig(program ?? undefined);
  const baseHref = typeof resolved?.join_base === 'string' ? resolved.join_base.trim() : '';
  return isHttpUrl(baseHref) && !isBlockedJoinPath(baseHref);
};
