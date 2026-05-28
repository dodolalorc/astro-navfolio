import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const projectRoot = process.cwd();
const uiCharsPath = join(projectRoot, 'scripts/fonts/ui-chars.txt');
const outputFontPath = join(projectRoot, 'public/fonts/lxgw-ui-subset.woff2');
const sourceFontPath = join(projectRoot, 'public/fonts/LXGWWenKai-Regular.ttf');

const sourceDirs = ['src/pages', 'src/components', 'src/layouts', 'src/config'];
const contentFrontmatterDirs = ['src/content/blog', 'src/content/projects', 'src/content/vibe'];
const lightweightContentDirs = ['src/content/vibe'];
const lightweightContentFiles = [
  'src/content/about.mdx',
  'src/content/about.md',
  'src/content/projects/index.mdx',
  'src/content/projects/index.md',
];
const sourceExtensions = new Set(['.astro', '.ts', '.js', '.mjs', '.cjs', '.json', '.toml']);
const frontmatterExtensions = new Set(['.md', '.mdx']);
const frontmatterKeys = new Set(['title', 'description', 'tags', 'categories', 'series']);
const cjkPattern =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u3000-\u303f\uff00-\uffef]/u;

function walkFiles(dir: string, extensions: Set<string>) {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(path, extensions));
      continue;
    }

    if (entry.isFile() && extensions.has(extname(entry.name))) files.push(path);
  }

  return files;
}

function collectCjk(chars: Set<string>, text: string) {
  for (const char of text) {
    if (cjkPattern.test(char)) chars.add(char);
  }
}

function extractFrontmatter(text: string) {
  if (!text.startsWith('---')) return '';

  const endIndex = text.indexOf('\n---', 3);
  if (endIndex === -1) return '';

  return text.slice(3, endIndex);
}

function extractFrontmatterFields(frontmatter: string) {
  const values: string[] = [];
  let activeKey: string | null = null;

  for (const line of frontmatter.split(/\r?\n/)) {
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (keyMatch) {
      activeKey = keyMatch[1];
      if (frontmatterKeys.has(activeKey)) values.push(keyMatch[2]);
      continue;
    }

    if (activeKey && frontmatterKeys.has(activeKey) && /^\s+/.test(line)) {
      values.push(line);
    }
  }

  return values.join('\n');
}

function runSubset() {
  const args = [
    sourceFontPath,
    `--text-file=${uiCharsPath}`,
    `--output-file=${outputFontPath}`,
    '--flavor=woff2',
    '--with-zopfli',
    '--layout-features=*',
    '--name-IDs=*',
    '--glyph-names',
    '--notdef-glyph',
    '--notdef-outline',
    '--recommended-glyphs',
    '--no-hinting',
  ];

  const commands = [
    { command: 'pyftsubset', args },
    { command: 'python', args: ['-m', 'fontTools.subset', ...args] },
  ];

  for (const { command, args: commandArgs } of commands) {
    const result = spawnSync(command, commandArgs, { stdio: 'inherit' });
    if (result.status === 0) {
      return;
    }

    if (result.error && 'code' in result.error && result.error.code === 'ENOENT') continue;
  }

  throw new Error(
    'Unable to run fonttools. Install it with `python -m pip install --user fonttools brotli`, or make `pyftsubset` available on PATH.',
  );
}

const chars = new Set<string>();

for (const dir of sourceDirs) {
  for (const file of walkFiles(join(projectRoot, dir), sourceExtensions)) {
    collectCjk(chars, readFileSync(file, 'utf8'));
  }
}

for (const dir of contentFrontmatterDirs) {
  for (const file of walkFiles(join(projectRoot, dir), frontmatterExtensions)) {
    const frontmatter = extractFrontmatter(readFileSync(file, 'utf8'));
    collectCjk(chars, extractFrontmatterFields(frontmatter));
  }
}

for (const dir of lightweightContentDirs) {
  for (const file of walkFiles(join(projectRoot, dir), frontmatterExtensions)) {
    collectCjk(chars, readFileSync(file, 'utf8'));
  }
}

for (const file of lightweightContentFiles) {
  const path = join(projectRoot, file);
  if (existsSync(path)) collectCjk(chars, readFileSync(path, 'utf8'));
}

const uiChars = [...chars].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('');
if (!uiChars) throw new Error('No CJK UI characters were found for font subsetting.');

mkdirSync(join(projectRoot, 'scripts/fonts'), { recursive: true });
mkdirSync(join(projectRoot, 'public/fonts'), { recursive: true });
writeFileSync(uiCharsPath, `${uiChars}\n`, 'utf8');

if (!existsSync(sourceFontPath)) {
  throw new Error(
    'LXGW WenKai source font not found. Place the full font at public/fonts/LXGWWenKai-Regular.ttf.',
  );
}

runSubset();

console.log(`Generated ${uiCharsPath} with ${uiChars.length} CJK UI characters.`);
console.log(`Generated ${outputFontPath} from ${sourceFontPath}.`);
