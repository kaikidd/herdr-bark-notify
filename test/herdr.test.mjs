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
