const normalizeIdValue = (value: string): string => value.trim().normalize('NFKC');

const safeDecodeHashPart = (value: string): string => {
  let decoded = value;

  for (let index = 0; index < 2; index += 1) {
    try {
      const nextDecoded = decodeURIComponent(decoded);
      if (nextDecoded === decoded) {
        break;
      }

      decoded = nextDecoded;
    } catch {
      break;
    }
  }

  return decoded;
};

export const normalizeHash = (value: string): string => {
  if (!value) {
    return '';
  }

  const hashIndex = value.indexOf('#');
  const rawHash = hashIndex >= 0 ? value.slice(hashIndex + 1) : value;
  if (!rawHash) {
    return '';
  }

  const decodedValue = safeDecodeHashPart(rawHash.replace(/^#+/, ''));
  const normalizedId = normalizeIdValue(decodedValue);
  return normalizedId ? `#${normalizedId}` : '';
};

export const buildHashIdCandidates = (hash: string): string[] => {
  const normalizedHash = normalizeHash(hash);
  if (!normalizedHash) {
    return [];
  }

  const normalizedId = normalizedHash.slice(1);
  return Array.from(
    new Set([
      normalizedId,
      safeDecodeHashPart(normalizedId),
      encodeURIComponent(normalizedId),
      safeDecodeHashPart(encodeURIComponent(normalizedId)),
    ]),
  );
};

export { normalizeIdValue, safeDecodeHashPart };
