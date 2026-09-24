# DMA U1–U2 homework starter

Files in this directory are linked by the three student-facing homework candidates.

- `dma-u1-u2-homework-starter.ipynb`: shared Colab notebook and fixed six-section submission skeleton.
- `dma_hw_starter.py`: deterministic cases, model, training, sampling, metrics, diagnostics, plotting, and budget guards.

## Instructor workflow

1. Collect the roster identifiers exactly as students will type them.
2. Run `make_case(student_id)` and `reference_metrics(case)` for every identifier.
3. Train the appropriate baseline configuration with the published seed.
4. Save each baseline with `save_checkpoint(run, case, path)` and publish the matching file privately to that student.
5. Reject or remap cases unless the real-vs-real reference exceeds each baseline metric by at least `0.03`; otherwise the 40% gap-closure denominator would be unstable or point in the wrong direction.
6. Before release, test at least two legal interventions per case family and record expected runtime on a clean Colab CPU and GPU.

Run a short integrity check in an environment with PyTorch installed:

```bash
python dma_hw_starter.py --smoke
```

The smoke test uses 20 training steps and 128 evaluation samples. It checks shapes, budgets, metrics, and time-bin diagnostics; it is not a calibration run.
