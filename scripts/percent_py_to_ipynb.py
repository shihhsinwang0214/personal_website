"""Convert a lightweight Jupytext-style percent Python file into an ipynb.

Usage: python percent_py_to_ipynb.py input.py output.ipynb
Only `# %%` and `# %% [markdown]` markers are interpreted.
"""
import ast
import json
import sys
from pathlib import Path


def markdown_source(lines):
    out = []
    for line in lines:
        if line.startswith("# "):
            out.append(line[2:])
        elif line.startswith("#"):
            out.append(line[1:])
        else:
            out.append(line)
    return out


def main(src_path, dst_path):
    lines = Path(src_path).read_text(encoding="utf-8").splitlines(keepends=True)
    cells = []
    kind = None
    buf = []

    def flush():
        nonlocal buf
        if kind is None:
            buf = []
            return
        source = markdown_source(buf) if kind == "markdown" else buf
        if kind == "code":
            # Ignore IPython line magics during static syntax validation.
            check = "".join(line for line in source if not line.lstrip().startswith("%"))
            ast.parse(check)
            cell = {"cell_type": "code", "execution_count": None, "metadata": {},
                    "outputs": [], "source": source}
        else:
            cell = {"cell_type": "markdown", "metadata": {}, "source": source}
        cells.append(cell)
        buf = []

    for line in lines:
        if line.startswith("# %%"):
            flush()
            kind = "markdown" if "[markdown]" in line else "code"
        else:
            buf.append(line)
    flush()

    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "version": "3.10"},
            "colab": {"name": Path(dst_path).name, "provenance": []},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }
    Path(dst_path).write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {dst_path}: {len(cells)} cells")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
