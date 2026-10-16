import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conditionalData, conditionalLoss, distributionComparison, distributionPython, mixtureDensity, mixtureGradient, mixtureNLL, mixtureSamples, normalCDF, observationDensity, seededRandom, selectedDensity, selectedSamples, trainConditional, trainMixture } from '../src/lib/dojoDistributions.ts';

function integrate(f: (x: number) => number) {
  const dx = 0.002;
  let area = 0;
  for (let x = -6; x < 6; x += dx) area += f(x + dx / 2) * dx;
  return area;
}

test('the shared toy distribution is normalized and its CDF is symmetric', () => {
  assert.ok(Math.abs(integrate(mixtureDensity) - 1) < 1e-9);
  assert.ok(Math.abs(normalCDF(2, 2) - 0.5) < 1e-8);
  assert.ok(normalCDF(1, 2) < normalCDF(2, 2));
  assert.ok(Math.abs(normalCDF(1, 2) + normalCDF(3, 2) - 1) < 1e-10);
});

test('conditional training reduces data loss and learns both labelled means', () => {
  const data = conditionalData();
  const initial = [0, 0];
  const trained = trainConditional(initial, data, 100);
  assert.deepEqual(initial, [0, 0]);
  assert.ok(trained.loss < conditionalLoss(initial, data) / 10);
  assert.ok(Math.abs(trained.means[0] + 2) < 0.1);
  assert.ok(Math.abs(trained.means[1] - 2) < 0.1);
});

test('the implemented fine-tuning gradient agrees with the likelihood derivative', () => {
  const data = mixtureSamples(512, 0.9, seededRandom(61));
  const theta = 0.7, h = 1e-5;
  const numerical = (mixtureNLL(theta + h, data) - mixtureNLL(theta - h, data)) / (2 * h);
  assert.ok(Math.abs(mixtureGradient(theta, data) - numerical) < 1e-8);
});

test('fine-tuning learns the preferred weight and can subsequently adapt to opposite data', () => {
  const rightData = mixtureSamples(512, 0.9, seededRandom(61));
  const right = trainMixture(0, rightData, 150);
  assert.ok(right.loss < mixtureNLL(0, rightData));
  assert.ok(right.right > 0.85 && right.right < 0.96);
  const leftData = mixtureSamples(512, 0.1, seededRandom(61));
  const left = trainMixture(right.logit, leftData, 150);
  assert.ok(left.loss < mixtureNLL(right.logit, leftData));
  assert.ok(left.right < 0.15);
});

test('Best-of-N return densities are normalized, match the base at N=1, and mirror for opposite rewards', () => {
  for (const x of [-3, -2, 0, 2, 3]) {
    assert.equal(selectedDensity(x, 1, 1), mixtureDensity(x));
    assert.ok(Math.abs(selectedDensity(x, 8, 1) - selectedDensity(-x, 8, -1)) < 1e-7);
  }
  assert.ok(Math.abs(integrate((x) => selectedDensity(x, 8, 1)) - 1) < 1e-6);
  assert.ok(Math.abs(integrate((x) => selectedDensity(x, 64, -1)) - 1) < 2e-6);
});

test('actual generated and selected samples shift toward reward tails', () => {
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const base = selectedSamples(2000, 1, 1, seededRandom(42));
  const high = selectedSamples(2000, 8, 1, seededRandom(42));
  const low = selectedSamples(2000, 8, -1, seededRandom(42));
  assert.ok(Math.abs(mean(base)) < 0.15);
  assert.ok(mean(high) > 2.4);
  assert.ok(mean(low) < -2.4);
});

test('each Python implementation generates samples and plots both a density and histogram', () => {
  for (const method of ['conditional', 'finetune', 'steering'] as const) {
    const source = distributionPython(method);
    assert.ok(source.includes('import matplotlib.pyplot as plt'));
    assert.ok(source.includes('plt.plot(grid, after'));
    assert.ok(source.includes('plt.hist(samples'));
    assert.ok(source.includes('plt.show()'));
    for (const section of ['# 1.', '# 2.', '# 3.', '# 4.']) assert.ok(source.includes(section));
  }
  assert.ok(distributionPython('conditional', -1, 10).includes('c = 0'));
  assert.ok(distributionPython('finetune', 1, 20, 0.1).includes('preferred_right = 0.1'));
  assert.ok(distributionPython('steering', -1, 60, 0.9, 32).includes('N = 32\ndirection = -1'));
});

test('conditional A/B changes the input and density while preserving both learned means', () => {
  const [a, b] = distributionComparison('conditional');
  assert.deepEqual(a.means, b.means);
  assert.equal(a.updates, b.updates);
  assert.equal(a.choice, 1); assert.equal(b.choice, -1);
  assert.ok(observationDensity('conditional', a, 2) > observationDensity('conditional', b, 2) * 100);
});

test('fine-tuning A/B changes evaluation data and loss while preserving the exact learned model', () => {
  const [a, b] = distributionComparison('finetune');
  assert.equal(a.logit, b.logit);
  assert.equal(a.updates, b.updates);
  assert.equal(a.preferred, 0.9); assert.equal(b.preferred, 0.1);
  assert.ok(b.loss! > a.loss! + 1);
  for (const x of [-2, 0, 2]) assert.equal(observationDensity('finetune', a, x), observationDensity('finetune', b, x));
});

test('steering A/B increases actual candidate cost and moves the returned distribution without training', () => {
  const [a, b] = distributionComparison('steering');
  assert.deepEqual(a.means, [-2, 2]); assert.deepEqual(a.means, b.means);
  assert.equal(a.logit, b.logit); assert.equal(a.updates, 0); assert.equal(b.updates, 0);
  assert.equal(a.candidates, 1); assert.equal(b.candidates, 32);
  const mean = (xs: number[]) => xs.reduce((x, y) => x + y, 0) / xs.length;
  assert.ok(Math.abs(mean(a.samples)) < 0.2);
  assert.ok(mean(b.samples) > 2.7);
});
