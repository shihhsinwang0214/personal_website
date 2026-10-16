import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atLeastOne, simulateCandidates, tiltedB, ruleProbability, simulateRule, experimentPython } from '../src/lib/dojoExperiments.ts';

test('independent candidate probability, including impossible and certain hits', () => {
  assert.equal(atLeastOne(0, 100), 0);
  assert.equal(atLeastOne(1, 100), 1);
  assert.equal(atLeastOne(0.25, 1), 0.25);
  assert.ok(Math.abs(atLeastOne(0.01, 100) - 0.6339676587267709) < 1e-12);
  assert.ok(atLeastOne(1e-20, 10) > 0);
});

test('a hit does not erase the cost of the rest of its batch', () => {
  let calls = 0;
  const draws = [0.1, 0.9, 0.9, 0.9];
  const run = simulateCandidates(0.5, 2, 2, () => draws[calls++]);
  assert.equal(run.hits, 1);
  assert.deepEqual(run.preview, [true, false]);
  assert.equal(run.generated, 4);
  assert.equal(calls, 4);
});

test('tilting uses both base probability and exponential reward', () => {
  assert.ok(Math.abs(tiltedB(0.5, Math.log(3)) - 0.75) < 1e-12);
  assert.ok(Math.abs(tiltedB(0.1, Math.log(3)) - 0.25) < 1e-12);
  assert.ok(Math.abs(tiltedB(0.2, 0) - 0.2) < 1e-12);
  assert.equal(tiltedB(0, 1000), 0);
  assert.equal(tiltedB(1, 1000), 1);
  assert.equal(tiltedB(0.5, 1000), 1);
});

test('return rule and target distribution remain distinct', () => {
  assert.equal(ruleProbability(0.5, Math.log(3), 'base'), 0.5);
  assert.equal(ruleProbability(0.5, Math.log(3), 'best'), 1);
  assert.equal(ruleProbability(0, Math.log(3), 'best'), 0);
  const run = simulateRule(0.5, Math.log(3), 'tilt', 4, (() => {
    const draws = [0.1, 0.5, 0.74, 0.9]; let i = 0;
    return () => draws[i++];
  })());
  assert.equal(run.hits, 3);
  assert.equal(run.preview.length, 4);
  assert.ok(Math.abs(run.target - 0.75) < 1e-12);
});

test('invalid experiment parameters are rejected rather than silently coerced', () => {
  assert.throws(() => atLeastOne(-0.1, 10), RangeError);
  assert.throws(() => atLeastOne(0.5, 1.5), RangeError);
  assert.throws(() => simulateCandidates(0.5, 10, 0), RangeError);
  assert.throws(() => tiltedB(0.5, -1), RangeError);
  assert.throws(() => tiltedB(NaN, 1), RangeError);
});

test('editable Python receives the selected settings and keeps the rules explicit', () => {
  const candidates = experimentPython('candidates', 0.02, 50);
  assert.ok(candidates.includes('p = 0.02\nN = 50'));
  const proportions = experimentPython('proportions', 0.1, 10, 0, 'base');
  assert.ok(proportions.includes('base_b = 0.1\nstrength = 0\nrule = "base"'));
});
