import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

// Status events include agent metadata titles, but not user-assigned pane labels.
// Query only the event's pane and retain its original status/agent identity.
export async function enrichPaneTitle(event, env, execImpl = exec) {
  const data = event.data;
  if (data?.title?.trim?.() || data?.pane_title?.trim?.() || typeof data?.pane_id !== 'string' || !data.pane_id || !env.HERDR_BIN_PATH || !env.HERDR_SOCKET_PATH) return event;
  try {
    const { stdout } = await execImpl(env.HERDR_BIN_PATH, ['pane', 'get', data.pane_id], {
      env, timeout: 1000, maxBuffer: 256 * 1024, windowsHide: true,
    });
    const pane = JSON.parse(stdout)?.result?.pane;
    if (pane?.pane_id !== data.pane_id || pane.workspace_id !== data.workspace_id) return event;
    const title = [pane.label, pane.title, pane.terminal_title_stripped, pane.terminal_title].find(value => typeof value === 'string' && value.trim());
    if (title) return { ...event, data: { ...data, pane_title: title } };
  } catch {
    // Closed panes, unavailable servers and older hosts still get ID-based notifications.
  }
  return event;
}
