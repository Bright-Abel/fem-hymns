import * as SQLite from 'expo-sqlite';

export interface Stanza {
  id: number;
  stanza_number: number;
  is_chorus: number;
  text: string;
}

export async function ensureSavedTables(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_id INTEGER UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hymn_id) REFERENCES hymns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_id INTEGER UNIQUE NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hymn_id) REFERENCES hymns(id) ON DELETE CASCADE
    );
  `);
}

export interface FullHymn extends HymnSummary {
  meter: string | null;
  key_signature: string | null;
  audio_asset_path: string | null;
  stanzas: Stanza[];
}

export async function searchHymns(
  db: SQLite.SQLiteDatabase,
  query?: string,
  category?: string | null,
): Promise<HymnSummary[]> {
  const trimmed = query?.trim();

  // 1. Direct Number Search (e.g. "241")
  if (trimmed && /^\d+$/.test(trimmed)) {
    return await db.getAllAsync<HymnSummary>(
      'SELECT id, hymn_number, title, category, author FROM hymns WHERE hymn_number = ? LIMIT 1;',
      [parseInt(trimmed, 10)],
    );
  }

  // 2. Full-Text Search on Lyrics & Title
  if (trimmed) {
    const ftsQuery = `"${trimmed.replace(/"/g, '""')}"*`;
    return await db.getAllAsync<HymnSummary>(
      `SELECT h.id, h.hymn_number, h.title, h.category, h.author
       FROM hymns_fts f
       JOIN hymns h ON h.id = f.hymn_id
       WHERE hymns_fts MATCH ?
       ORDER BY rank
       LIMIT 30;`,
      [ftsQuery],
    );
  }

  // 3. Category Filter
  if (category && category !== 'All') {
    return await db.getAllAsync<HymnSummary>(
      'SELECT id, hymn_number, title, category, author FROM hymns WHERE category = ? ORDER BY hymn_number ASC;',
      [category],
    );
  }

  // 4. Default: All hymns in numerical order
  return await db.getAllAsync<HymnSummary>(
    'SELECT id, hymn_number, title, category, author FROM hymns ORDER BY hymn_number ASC;',
  );
}

export async function getHymnByNumber(
  db: SQLite.SQLiteDatabase,
  hymnNumber: number,
): Promise<HymnDetail | null> {
  // 1. Fetch Hymn metadata
  const hymn = await db.getFirstAsync<Omit<HymnDetail, 'stanzas'>>(
    `SELECT 
       id, 
       hymn_number, 
       title, 
       category, 
       author, 
       meter, 
       key_signature, 
       audio_asset_path AS audio_url
     FROM hymns
     WHERE hymn_number = ?;`,
    [hymnNumber],
  );

  if (!hymn) return null;

  // 2. Fetch all stanzas ordered by stanza_number
  const stanzas = await db.getAllAsync<StanzaItem>(
    `SELECT id, stanza_number, is_chorus, sequence, text
     FROM stanzas
     WHERE hymn_id = ?
      ORDER BY sequence ASC;`,
    [hymn.id],
  );

  return {
    ...hymn,
    stanzas,
  };
}

export async function getHymnsNumeric(
  db: SQLite.SQLiteDatabase,
  search?: string,
): Promise<HymnSummary[]> {
  const query = search?.trim();
  if (query) {
    if (/^\d+$/.test(query)) {
      return await db.getAllAsync<HymnSummary>(
        'SELECT id, hymn_number, title, category, author FROM hymns WHERE hymn_number = ? LIMIT 1;',
        [parseInt(query, 10)],
      );
    }
    const ftsQuery = `"${query.replace(/"/g, '""')}"*`;
    return await db.getAllAsync<HymnSummary>(
      `SELECT h.id, h.hymn_number, h.title, h.category, h.author 
       FROM hymns_fts f 
       JOIN hymns h ON h.id = f.hymn_id 
       WHERE hymns_fts MATCH ? 
       ORDER BY h.hymn_number ASC;`,
      [ftsQuery],
    );
  }
  return await db.getAllAsync<HymnSummary>(
    'SELECT id, hymn_number, title, category, author FROM hymns ORDER BY hymn_number ASC;',
  );
}

// 2. A-Z List (Alphabetical by title)
export async function getHymnsAlphabetical(
  db: SQLite.SQLiteDatabase,
  search?: string,
): Promise<HymnSummary[]> {
  const query = search?.trim();
  if (query) {
    const ftsQuery = `"${query.replace(/"/g, '""')}"*`;
    return await db.getAllAsync<HymnSummary>(
      `SELECT h.id, h.hymn_number, h.title, h.category, h.author 
       FROM hymns_fts f 
       JOIN hymns h ON h.id = f.hymn_id 
       WHERE hymns_fts MATCH ? 
       ORDER BY h.title COLLATE NOCASE ASC;`,
      [ftsQuery],
    );
  }
  return await db.getAllAsync<HymnSummary>(
    'SELECT id, hymn_number, title, category, author FROM hymns ORDER BY title COLLATE NOCASE ASC;',
  );
}

export async function getFavoriteHymns(
  db: SQLite.SQLiteDatabase,
  search: string = '',
): Promise<SavedHymnItem[]> {
  const query = search.trim();
  if (query) {
    return await db.getAllAsync<SavedHymnItem>(
      `SELECT 
         h.id, 
         h.hymn_number, 
         h.title, 
         h.category, 
         h.author,
         f.created_at AS saved_at
       FROM favorites f
       JOIN hymns h ON f.hymn_id = h.id
       WHERE h.title LIKE ? OR h.hymn_number LIKE ?
       ORDER BY f.created_at DESC;`,
      [`%${query}%`, `%${query}%`],
    );
  }

  return await db.getAllAsync<SavedHymnItem>(
    `SELECT 
       h.id, 
       h.hymn_number, 
       h.title, 
       h.category, 
       h.author,
       f.created_at AS saved_at
     FROM favorites f
     JOIN hymns h ON f.hymn_id = h.id
     ORDER BY f.created_at DESC;`,
  );
}

// 2. Fetch all Bookmarks
export async function getBookmarkedHymns(
  db: SQLite.SQLiteDatabase,
  search: string = '',
): Promise<SavedHymnItem[]> {
  const query = search.trim();
  if (query) {
    return await db.getAllAsync<SavedHymnItem>(
      `SELECT 
         h.id, 
         h.hymn_number, 
         h.title, 
         h.category, 
         h.author,
         b.notes,
         b.created_at AS saved_at
       FROM bookmarks b
       JOIN hymns h ON b.hymn_id = h.id
       WHERE h.title LIKE ? OR h.hymn_number LIKE ?
       ORDER BY b.created_at DESC;`,
      [`%${query}%`, `%${query}%`],
    );
  }

  return await db.getAllAsync<SavedHymnItem>(
    `SELECT 
       h.id, 
       h.hymn_number, 
       h.title, 
       h.category, 
       h.author,
       b.notes,
       b.created_at AS saved_at
     FROM bookmarks b
     JOIN hymns h ON b.hymn_id = h.id
     ORDER BY b.created_at DESC;`,
  );
}

export async function isHymnFavorite(
  db: SQLite.SQLiteDatabase,
  hymnId: number,
): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) as count FROM favorites WHERE hymn_id = ?;`,
    [hymnId],
  );
  return (result?.count ?? 0) > 0;
}

export async function toggleHymnFavorite(
  db: SQLite.SQLiteDatabase,
  hymnId: number,
): Promise<boolean> {
  const isFav = await isHymnFavorite(db, hymnId);
  if (isFav) {
    await db.runAsync(`DELETE FROM favorites WHERE hymn_id = ?;`, [hymnId]);
    return false;
  } else {
    await db.runAsync(`INSERT INTO favorites (hymn_id) VALUES (?);`, [hymnId]);
    return true;
  }
}

export async function isHymnBookmarked(
  db: SQLite.SQLiteDatabase,
  hymnId: number,
): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) as count FROM bookmarks WHERE hymn_id = ?;`,
    [hymnId],
  );
  return (result?.count ?? 0) > 0;
}

export async function toggleHymnBookmark(
  db: SQLite.SQLiteDatabase,
  hymnId: number,
): Promise<boolean> {
  const isBookmarked = await isHymnBookmarked(db, hymnId);
  if (isBookmarked) {
    await db.runAsync(`DELETE FROM bookmarks WHERE hymn_id = ?;`, [hymnId]);
    return false;
  } else {
    await db.runAsync(`INSERT INTO bookmarks (hymn_id) VALUES (?);`, [hymnId]);
    return true;
  }
}
