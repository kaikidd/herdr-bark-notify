import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, agentDefaults } from '../src/agents.mjs';
import { normalizeConfig } from '../src/config.mjs';
import { buildNotification, sampleEvent } from '../src/message.mjs';

test('maps the Herdr 0.9.0 inventory, leaving four missing avatars unset', () => {
  const canonical = 'pi claude codex gemini cursor devin agy cline omp mastracode opencode copilot kimi kiro droid amp grok hermes kilo qodercli qwen maki muse'.split(' ');
  assert.deepEqual(Object.keys(AGENTS).sort(), canonical.sort());
  assert.deepEqual(canonical.filter(id => !agentDefaults(id).icon).sort(), ['droid', 'maki', 'muse', 'omp']);
  const icons = canonical.map(id => agentDefaults(id).icon).filter(Boolean);
  assert.equal(new Set(icons).size, 19);
  for (const icon of icons) assert.match(icon, /^https:\/\/unpkg\.com\/@lobehub\/icons-static-png@1\.97\.0\/light\/[a-z]+\.png$/);
});

test('resolves product-specific and brand avatars with exact aliases, not display labels', () => {
  assert.match(agentDefaults('claude-code').icon, /\/claudecode\.png$/);
  assert.match(agentDefaults('gemini').icon, /\/geminicli\.png$/);
  assert.match(agentDefaults('agy').icon, /\/antigravity\.png$/);
  assert.match(agentDefaults('copilot').icon, /\/githubcopilot\.png$/);
  for (const id of ['unknown', '__proto__', 'constructor', 'claude-my-custom-agent']) assert.equal(agentDefaults(id), undefined);
  const event = sampleEvent();
  event.data.display_agent = 'Claude Code';
  assert.match(buildNotification(normalizeConfig({}), event).payload.icon, /\/codex\.png$/);
});

test('default avatars work for both states; user icons override and null disables', () => {
  for (const status of ['done', 'blocked']) {
    const event = sampleEvent(status);
    assert.match(buildNotification(normalizeConfig({}), event).payload.icon, /\/codex\.png$/);
    for (const icon of [null, '']) {
      assert.equal(buildNotification(normalizeConfig({ notification: { icon } }), event).payload.icon, undefined);
    }
    const config = normalizeConfig({ notification: { icon: 'https://example.com/global.png' }, agents: { codex: { notification: { icon: 'https://example.com/custom.png' } } } });
    assert.equal(buildNotification(config, event).payload.icon, 'https://example.com/custom.png');
    event.data.agent = 'droid';
    assert.equal(buildNotification(normalizeConfig({}), event).payload.icon, undefined);
    assert.equal(buildNotification(config, event).payload.icon, 'https://example.com/global.png');
  }
});
