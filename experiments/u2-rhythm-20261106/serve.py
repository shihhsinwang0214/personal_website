"""Open the independent, already-built U2 preview. No production site changes."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import argparse
import threading
import webbrowser

parser = argparse.ArgumentParser(description='U2 independent reading preview')
parser.add_argument('--port', type=int, default=8766)
parser.add_argument('--no-browser', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parent / 'dist'
url = f'http://127.0.0.1:{args.port}/'
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
try:
    server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
except OSError as error:
    print(f'無法啟動 {url}：{error}')
    print('如果原本的預覽已在執行，可以直接開啟該網址。')
    raise SystemExit(1)
print(f'U2 完整試讀：{url}')
print('Ctrl+C 停止。首次執行 Python 小實驗時，需要網路下載環境。')
if not args.no_browser:
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\n已停止本機預覽。')
finally:
    server.server_close()
