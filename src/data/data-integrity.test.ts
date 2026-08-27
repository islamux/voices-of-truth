import { describe, expect, it } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scholars } from './scholars';
import { countries } from './countries';
import { specializations } from './specializations';

const AVATAR_DIR = join(process.cwd(), 'public', 'avatars');
const LANGUAGE_VOCABULARY = new Set(['Arabic', 'English', 'French', 'Urdu']);

describe('scholars data integrity', () => {
  it('has a non-empty directory', () => {
    expect(scholars.length).toBeGreaterThan(0);
  });

  it('has unique scholar ids', () => {
    const ids = new Set<number>();
    const duplicates: number[] = [];
    for (const scholar of scholars) {
      if (ids.has(scholar.id)) duplicates.push(scholar.id);
      ids.add(scholar.id);
    }
    expect(duplicates).toEqual([]);
  });

  it('references an existing countryId for every scholar', () => {
    const countryIds = new Set(countries.map((c) => c.id));
    const orphans = scholars.filter((s) => !countryIds.has(s.countryId));
    expect(orphans).toEqual([]);
  });

  it('references an existing categoryId for every scholar', () => {
    const categoryIds = new Set(specializations.map((s) => s.id));
    const orphans = scholars.filter((s) => !categoryIds.has(s.categoryId));
    expect(orphans).toEqual([]);
  });
});

describe('avatar integrity', () => {
  const resolveAvatar = (url: string) => url.replace(/^\/avatars\//, '');

  const avatarFiles = new Set(readdirSync(AVATAR_DIR));

  it('points every avatarUrl at an existing file', () => {
    const missing = scholars.filter(
      (s) => !avatarFiles.has(resolveAvatar(s.avatarUrl)),
    );
    expect(missing.map((s) => s.avatarUrl)).toEqual([]);
  });

  it('provides an avatarUrl for every scholar', () => {
    const withoutAvatar = scholars.filter((s) => !s.avatarUrl);
    expect(withoutAvatar).toEqual([]);
  });

  it('advertises every avatar file (no avatar is orphaned)', () => {
    const advertised = new Set(
      scholars.map((s) => resolveAvatar(s.avatarUrl)),
    );
    const orphans = [...avatarFiles].filter(
      (f) => f !== 'default-avatar.png' && !advertised.has(f),
    );
    expect(orphans).toEqual([]);
  });
});

describe('language vocabulary', () => {
  it('uses only known language labels', () => {
    const unknown = new Set<string>();
    for (const scholar of scholars) {
      for (const lang of scholar.language) {
        if (!LANGUAGE_VOCABULARY.has(lang)) unknown.add(lang);
      }
    }
    expect([...unknown]).toEqual([]);
  });
});
