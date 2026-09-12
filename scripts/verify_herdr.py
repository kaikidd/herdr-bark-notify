import json, os, pathlib, socket, subprocess, tempfile, time, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
# Optional integration check: Python 3 + Herdr 0.9+ on macOS/Linux.
# Uses isolated config/state/socket paths and a local mock; no real Bark key.
repo=pathlib.Path(__file__).resolve().parents[1]
received=[]
class Handler(BaseHTTPRequestHandler):
 def do_POST(self):
  received.append(json.loads(self.rfile.read(int(self.headers['Content-Length']))))
  self.send_response(200); self.end_headers(); self.wfile.write(b'{"code":200}')
 def log_message(self,*args): pass
with tempfile.TemporaryDirectory(prefix='hbn-', dir='/tmp') as root:
 root=pathlib.Path(root)
 env={k:v for k,v in os.environ.items() if not k.startswith(('HERDR_', 'BARK_')) and k!='ENV'}
 env.update(XDG_CONFIG_HOME=str(root/'config'),XDG_STATE_HOME=str(root/'state'),HERDR_SOCKET_PATH=str(root/'api.sock'),HERDR_CONFIG_PATH=str(root/'config/herdr/config.toml'))
 cfg=root/'config/herdr'; cfg.mkdir(parents=True)
 (cfg/'config.toml').write_text('[terminal]\ndefault_shell = "/bin/sh"\n')
 def cli(*args):
  result=subprocess.run(['herdr',*args],env=env,cwd=root,capture_output=True,text=True,timeout=10)
  if result.returncode: raise RuntimeError(result.stderr or result.stdout)
  return result.stdout
 print('VERSION',cli('--version').strip())
 cli('plugin','link',str(repo))
 print('PASS: plugin linked in isolated registry')
 listed=json.loads(cli('plugin','list','--json'))
 assert any(p['plugin_id']=='herdr.bark-notify' for p in listed['result']['plugins'])
 config_dir=pathlib.Path(cli('plugin','config-dir','herdr.bark-notify').strip())
 assert str(config_dir).startswith(str(root))
 http=ThreadingHTTPServer(('127.0.0.1',0),Handler)
 threading.Thread(target=http.serve_forever,daemon=True).start()
 (config_dir/'config.json').write_text(json.dumps({'bark_url':f'http://127.0.0.1:{http.server_port}/test-key','locale':'en'}))
 log=open(root/'server.log','w')
 server=subprocess.Popen(['herdr','server'],env=env,cwd=root,stdout=log,stderr=log)
 def api(method,params={}):
  with socket.socket(socket.AF_UNIX) as s:
   s.settimeout(5); s.connect(env['HERDR_SOCKET_PATH'])
   s.sendall((json.dumps({'id':'smoke','method':method,'params':params})+'\n').encode())
   response=json.loads(s.makefile().readline())
   if 'error' in response: raise RuntimeError(response)
   return response['result']
 try:
  deadline=time.monotonic()+10
  while time.monotonic()<deadline:
   if server.poll() is not None: raise RuntimeError((root/'server.log').read_text()[-3000:])
   if pathlib.Path(env['HERDR_SOCKET_PATH']).exists(): break
   time.sleep(.1)
  print('PING',api('ping'))
  actions=json.loads(cli('plugin','action','list','--plugin','herdr.bark-notify'))['result']['actions']
  assert len(actions)==4
  for action in ['check','preview','test-done','test-blocked']:
   cli('plugin','action','invoke','herdr.bark-notify.'+action)
  api('workspace.create',{'label':'Foreground test workspace','cwd':str(root),'focus':True})
  created=api('workspace.create',{'label':'Bark smoke workspace','cwd':str(root),'focus':False})
  pane=created['root_pane']['pane_id']
  api('pane.rename',{'pane_id':pane,'label':'Bark smoke pane'})
  for seq,state in enumerate(['working','blocked','working','idle'],1):
   print('STATE',state,api('pane.report_agent',{'pane_id':pane,'source':'plugin:bark-smoke','agent':'codex','state':state,'seq':seq}))
   time.sleep(.3)
  deadline=time.monotonic()+8
  while len(received)<4 and time.monotonic()<deadline: time.sleep(.1)
  print('RECEIVED',json.dumps(received,ensure_ascii=False))
  logs=json.loads(cli('plugin','log','list','--plugin','herdr.bark-notify'))['result']['logs']
  assert all(item['status']=='succeeded' and item['exit_code']==0 for item in logs), logs
  assert len(received)==4, len(received)
  automatic=[p for p in received if not p['title'].startswith('[TEST')]
  assert len(automatic)==2
  assert all(p['subtitle']=='Bark smoke workspace / Bark smoke pane' for p in automatic)
  assert {p['title'] for p in automatic}=={'✓ Codex · Done','⚠ Codex · Needs attention'}
  print('HERDR_SMOKE_PASS')
 finally:
  try: api('server.stop')
  except Exception: pass
  try: server.wait(timeout=5)
  except subprocess.TimeoutExpired: server.terminate(); server.wait(timeout=5)
  http.shutdown(); http.server_close(); log.close()
