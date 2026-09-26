import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Starting hymnal database build...');

const RAW_PATH = path.join(__dirname, '../data-pipeline/raw_hymns.json');
const ASSETS_DIR = path.join(__dirname, '../assets');
const DB_PATH = path.join(ASSETS_DIR, 'hymnal.db');

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
      `❌ Error: Cannot find ${RAW_PATH}. Make sure data-pipeline/raw_hymns.json exists.`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  const rawFile = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));
  const rawHymns: RawHymn[] = rawFile.hymns || rawFile;

  console.log(
    `📖 Read ${rawHymns.length} hymns. Initializing SQLite tables with FTS5...`,
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
    `✅ Successfully compiled ${rawHymns.length} hymns into assets/hymnal.db!`,
  );
}

compile();
