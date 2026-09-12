// Herdr 0.9.0 `agent start --help` lists these 23 canonical agent IDs.
// Use LobeHub's 640×640 PNG logos: the WebP Avatar assets failed real Bark display tests.
export const AVATAR_BASE_URL = 'https://unpkg.com/@lobehub/icons-static-png@1.97.0/light';

export const AGENTS = Object.freeze({
  pi: { name: 'Pi', avatar: 'pi' },
  claude: { name: 'Claude Code', avatar: 'claudecode' },
  codex: { name: 'Codex', avatar: 'codex' },
  gemini: { name: 'Gemini CLI', avatar: 'geminicli' },
  cursor: { name: 'Cursor Agent', avatar: 'cursor' },
  devin: { name: 'Devin CLI', avatar: 'devin' },
  agy: { name: 'Antigravity CLI', avatar: 'antigravity' },
  cline: { name: 'Cline', avatar: 'cline' },
  omp: { name: 'OMP', avatar: null },
  mastracode: { name: 'MastraCode', avatar: 'mastra' },
  opencode: { name: 'OpenCode', avatar: 'opencode' },
  copilot: { name: 'GitHub Copilot CLI', avatar: 'githubcopilot' },
  kimi: { name: 'Kimi Code CLI', avatar: 'kimi' },
  kiro: { name: 'Kiro CLI', avatar: 'kiro' },
  droid: { name: 'Droid', avatar: null },
  amp: { name: 'Amp', avatar: 'amp' },
  grok: { name: 'Grok CLI', avatar: 'grok' },
  hermes: { name: 'Hermes Agent', avatar: 'hermesagent' },
  kilo: { name: 'Kilo Code CLI', avatar: 'kilocode' },
  qodercli: { name: 'Qoder CLI', avatar: 'qoder' },
  qwen: { name: 'Qwen Code', avatar: 'qwen' },
  maki: { name: 'Maki', avatar: null },
  muse: { name: 'Muse', avatar: null },
});

const aliases = Object.freeze({
  'claude-code': 'claude', claude_code: 'claude',
  'gemini-cli': 'gemini', 'cursor-agent': 'cursor',
  antigravity: 'agy', 'github-copilot': 'copilot',
  'kimi-code': 'kimi', 'kilo-code': 'kilo', qoder: 'qodercli',
  'qwen-code': 'qwen', 'hermes-agent': 'hermes',
});

export function agentDefaults(agentId) {
  const canonical = Object.hasOwn(aliases, agentId) ? aliases[agentId] : agentId;
  if (!Object.hasOwn(AGENTS, canonical)) return undefined;
  const { name, avatar } = AGENTS[canonical];
  return { name, ...(avatar ? { icon: `${AVATAR_BASE_URL}/${avatar}.png` } : {}) };
}
