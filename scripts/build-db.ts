import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Starting hymnal database build...');

const RAW_PATH = path.join(__dirname, '../data-pipeline/raw_hymns2.json');
const ASSETS_DIR = path.join(__dirname, '../assets');
const DB_PATH = process.env.HYMNAL_DB_PATH
  ? path.resolve(process.env.HYMNAL_DB_PATH)
  : path.join(ASSETS_DIR, 'hymnal.db');

interface RawLyric {
  verse?: number;
  content: string;
  type: string; // 'verse' | 'chorus'
}

interface RawHymn {
  id: number;
  number: string | number;
  title: string;
  category?: string;
  author?: string;
  meter?: string;
  key_signature?: string;
  audio_filename?: string;
  lyrics: RawLyric[];
}

function compile() {
  if (!fs.existsSync(RAW_PATH)) {
    console.error(
      `❌ Error: Cannot find ${RAW_PATH}. Make sure data-pipeline/raw_hymns2.json exists.`,
    );
    process.exit(1);
  }

  const rawFile = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));
  const sourceHymns: RawHymn[] = rawFile.hymns || rawFile;
  const hymnsByNumber = new Map<number, RawHymn>();
  let duplicateCount = 0;
  let fullerRecordCount = 0;

  for (const hymn of sourceHymns) {
    const hymnNumber = Number(hymn.number);
    if (!Number.isSafeInteger(hymnNumber)) {
      throw new Error(`Invalid hymn number: ${hymn.number}`);
    }

    const existing = hymnsByNumber.get(hymnNumber);
    if (!existing) {
      hymnsByNumber.set(hymnNumber, hymn);
      continue;
    }

    const metadata = (entry: RawHymn) =>
      JSON.stringify({
        title: entry.title,
        category: entry.category ?? null,
        author: entry.author ?? null,
        meter: entry.meter ?? null,
        key_signature: entry.key_signature ?? null,
        audio_filename: entry.audio_filename ?? null,
      });

    if (metadata(existing) !== metadata(hymn)) {
      throw new Error(
        `Conflicting records for hymn number ${hymnNumber}: "${existing.title}" and "${hymn.title}".`,
      );
    }

    if (JSON.stringify(existing) === JSON.stringify(hymn)) {
      duplicateCount += 1;
      continue;
    }

    const lyricLength = (entry: RawHymn) =>
      entry.lyrics.reduce((length, lyric) => length + lyric.content.length, 0);
    const existingLength = lyricLength(existing);
    const incomingLength = lyricLength(hymn);

    if (existingLength === incomingLength) {
      throw new Error(
        `Ambiguous lyric variants for hymn number ${hymnNumber}; resolve them in raw_hymns2.json before building.`,
      );
    }

    if (incomingLength > existingLength) {
      hymnsByNumber.set(hymnNumber, hymn);
      fullerRecordCount += 1;
    }
  }

  const rawHymns = Array.from(hymnsByNumber.values());

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  console.log(
    `📖 Read ${sourceHymns.length} records; building ${rawHymns.length} unique hymns (${duplicateCount} exact duplicates skipped, ${fullerRecordCount} fuller records selected). Initializing SQLite tables with FTS5...`,
  );

  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE hymns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_number INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      author TEXT,
      meter TEXT,
      key_signature TEXT,
      audio_asset_path TEXT
    );

    CREATE TABLE stanzas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_id INTEGER NOT NULL REFERENCES hymns(id) ON DELETE CASCADE,
      stanza_number INTEGER NOT NULL,
      is_chorus INTEGER DEFAULT 0,
      sequence INTEGER NOT NULL,
      text TEXT NOT NULL
    );

    CREATE TABLE favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_id INTEGER UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hymn_id) REFERENCES hymns(id) ON DELETE CASCADE
    );

    CREATE TABLE bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_id INTEGER UNIQUE NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hymn_id) REFERENCES hymns(id) ON DELETE CASCADE
    );

    CREATE VIRTUAL TABLE hymns_fts USING fts5(
      hymn_id UNINDEXED,
      hymn_number UNINDEXED,
      title,
      lyrics,
      tokenize = 'porter unicode61'
    );

    CREATE INDEX idx_hymns_num ON hymns(hymn_number);
    CREATE INDEX idx_stanzas_hymn ON stanzas(hymn_id, stanza_number);
  `);

  const insertHymn = db.prepare(`
    INSERT INTO hymns (hymn_number, title, category, author, meter, key_signature, audio_asset_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStanza = db.prepare(`
    INSERT INTO stanzas (hymn_id, stanza_number, is_chorus, sequence, text)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertFts = db.prepare(`
    INSERT INTO hymns_fts (hymn_id, hymn_number, title, lyrics)
    VALUES (?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const h of rawHymns) {
      const hymnNumber =
        typeof h.number === 'string' ? parseInt(h.number, 10) : h.number;

      const res = insertHymn.run(
        hymnNumber,
        h.title,
        h.category || null,
        h.author || null,
        h.meter || null,
        h.key_signature || null,
        h.audio_filename ? `audio/${h.audio_filename}` : null,
      );
      const hymnId = res.lastInsertRowid;

      // Preserve the source order so each chorus remains after the stanza it follows.
      let allLyrics = '';
      let verseCounter = 1;
      let currentStanzaNumber = 0;

      h.lyrics.forEach((item, sequence) => {
        if (item.type !== 'chorus') {
          currentStanzaNumber = item.verse ?? verseCounter;
          verseCounter = currentStanzaNumber + 1;
        }
        const text = item.content.trim();

        insertStanza.run(
          hymnId,
          currentStanzaNumber,
          item.type === 'chorus' ? 1 : 0,
          sequence,
          text,
        );
        allLyrics += ` ${text}`;
      });

      insertFts.run(hymnId, hymnNumber, h.title, allLyrics.trim());
    }
  });

  tx();
  console.log(
    `✅ Successfully compiled ${rawHymns.length} hymns into ${DB_PATH}!`,
  );
}

compile();
