import test from 'node:test';
import assert from 'node:assert/strict';
import { enrichPaneTitle } from '../src/herdr.mjs';
import { sampleEvent } from '../src/message.mjs';

const env = { HERDR_BIN_PATH: '/path with spaces/herdr', HERDR_SOCKET_PATH: '/tmp/test.sock' };
test('reads explicit pane label with argv; does not replace historical status or agent', async () => {
  const event = sampleEvent();
  delete event.data.title;
  const result = await enrichPaneTitle(event, env, async (bin, args, options) => {
    assert.equal(bin, env.HERDR_BIN_PATH);
    assert.deepEqual(args, ['pane', 'get', 'w1:p2']);
    assert.equal(options.timeout, 1000);
    return { stdout: JSON.stringify({ result: { pane: { pane_id: 'w1:p2', workspace_id: 'w1', label: 'User pane title', agent_status: 'working', agent: 'gemini' } } }) };
  });
  assert.equal(result.data.pane_title, 'User pane title');
  assert.equal(result.data.agent_status, 'done');
  assert.equal(result.data.agent, 'codex');
});

test('falls back to the terminal title when Herdr reports no pane name', async () => {
  const event = sampleEvent();
  delete event.data.title;
  const result = await enrichPaneTitle(event, env, async (bin, args) => {
    assert.deepEqual(args, ['pane', 'get', 'w1:p2']);
    return { stdout: JSON.stringify({ result: { pane: { pane_id: 'w1:p2', workspace_id: 'w1', terminal_title: '\u25d1 Build the API', terminal_title_stripped: 'Build the API' } } }) };
  });
  assert.equal(result.data.pane_title, 'Build the API');
});

test('an explicit pane name still wins over the terminal title', async () => {
  const event = sampleEvent();
  delete event.data.title;
  for (const pane of [
    { pane_id: 'w1:p2', workspace_id: 'w1', label: 'User pane title', terminal_title_stripped: 'Build the API' },
    { pane_id: 'w1:p2', workspace_id: 'w1', title: 'User pane title', terminal_title_stripped: 'Build the API' },
  ]) {
    const result = await enrichPaneTitle(event, env, async () => ({ stdout: JSON.stringify({ result: { pane } }) }));
    assert.equal(result.data.pane_title, 'User pane title');
  }
});

test('retains event title and ignores foreign, failed or unavailable lookups', async () => {
  const event = sampleEvent();
  await enrichPaneTitle(event, env, async () => assert.fail('event already has title'));
  delete event.data.title;
  for (const execute of [
    async () => { throw new Error('timeout'); },
    async () => ({ stdout: 'bad JSON' }),
    async () => ({ stdout: JSON.stringify({ result: { pane: { pane_id: 'w9:p9', workspace_id: 'w9', label: 'Wrong' } } }) }),
  ]) assert.equal(await enrichPaneTitle(event, env, execute), event);
  assert.equal(await enrichPaneTitle(event, {}, async () => assert.fail('no host context')), event);
});
