// Python is downloaded only after Run. Each worker can be terminated even if
// Python is in an infinite loop; it never receives the dialogue or saved progress.
const runtimeUrl = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';
const indexURL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let runtime: Promise<any> | undefined;

self.onmessage = async ({ data }: MessageEvent<{ code: string }>) => {
  let output = '';
  let diagnostics = '';
  let packages = true;
  let loaded = false;
  const diagnostic = (line: string) => { if (diagnostics.length < 16000) diagnostics += `${line}\n`.slice(0, 16000 - diagnostics.length); };
  const append = (line: string) => { if (packages) diagnostic(line); else if (output.length < 16000) output += `${line}\n`.slice(0, 16000 - output.length); };
  try {
    runtime ??= import(/* @vite-ignore */ runtimeUrl).then((mod) => mod.loadPyodide({ indexURL }));
    const python = await runtime;
    loaded = true;
    python.setStdout({ batched: append });
    python.setStderr({ batched: diagnostic });
    self.postMessage({ kind: 'packages' });
    await python.loadPackagesFromImports(data.code);
    const globals = python.toPy({ __name__: '__main__' });
    let images: string[] = [];
    try {
      const plotting = /(?:import|from)\s+(?:matplotlib|pylab)/.test(data.code);
      if (plotting) await python.runPythonAsync(`
import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt
import io as _dojo_io
import base64 as _dojo_base64
_dojo_figures = []
def _dojo_capture_figures(*args, **kwargs):
    for _number in plt.get_fignums():
        if len(_dojo_figures) >= 3:
            break
        _fig = plt.figure(_number)
        _size = _fig.get_size_inches()
        _fig.set_size_inches(min(float(_size[0]), 12), min(float(_size[1]), 8))
        _buffer = _dojo_io.BytesIO()
        _fig.savefig(_buffer, format="png", dpi=110, bbox_inches="tight")
        if _buffer.tell() < 2000000:
            _dojo_figures.append(_dojo_base64.b64encode(_buffer.getvalue()).decode("ascii"))
    plt.close("all")
plt.show = _dojo_capture_figures
`, { globals });
      packages = false;
      self.postMessage({ kind: 'running' });
      const result = await python.runPythonAsync(data.code, { globals });
      result?.destroy?.();
      if (plotting) {
        await python.runPythonAsync('_dojo_capture_figures()', { globals });
        const figures = globals.get('_dojo_figures');
        try { images = figures.toJs(); } finally { figures.destroy(); }
      }
    } finally {
      globals.destroy();
    }
    self.postMessage({ kind: 'done', output, diagnostics, images });
  } catch (error) {
    self.postMessage({ kind: 'error', output, diagnostics, error: String(error).slice(0, 8000), fatal: !loaded });
  }
};

export {};
