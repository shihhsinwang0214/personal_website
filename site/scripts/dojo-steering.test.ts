import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRandom, mixtureDensity } from '../src/lib/dojoDistributions.ts';
import { BASE, GRID, DX, defaults, guidedSamples, guidedScore, scores, posterior, posteriorDensity, posteriorWeight, reward, tiltedDensity, selectSamples, reverseBase, initializeSMC, stepSMC, runSMC, generator, logAcceptance, logSwap, runChains, summarize } from '../src/lib/dojoSteering.ts';
import { steeringPython } from '../src/lib/dojoSteeringPython.ts';

test('classifier input derivative matches a finite difference and the CFG identity', () => {
  for (const t of [.05,.3,.9]) for (const x of [-2,-.3,.6,2]) for (const c of [0,1]) {
    const s=scores(x,t,c),eps=1e-5;
    const derivative=(Math.log(scores(x+eps,t,c).probability)-Math.log(scores(x-eps,t,c).probability))/(2*eps);
    assert.ok(Math.abs(derivative-s.classifierGradient)<2e-5);
    for(const w of [0,1,3]) assert.ok(Math.abs(guidedScore(x,t,c,w,'classifier')-guidedScore(x,t,c,w,'cfg'))<1e-10);
  }
});
test('reverse SDE actually recovers base/conditional modes and changes c without training', () => {
  const s=defaults('classifier');
  const base=summarize(guidedSamples('classifier',{...s,strength:0}).samples);
  const right=summarize(guidedSamples('classifier',s).samples);
  const left=summarize(guidedSamples('classifier',{...s,condition:0}).samples);
  assert.ok(Math.abs(base.right-.5)<.06);
  assert.ok(Math.abs(right.mean-2)<.12 && right.right>.98);
  assert.ok(Math.abs(left.mean+2)<.12 && left.right<.02);
  const a=guidedSamples('classifier',s,50).samples,b=guidedSamples('cfg',s,50).samples;
  assert.ok(a.every((v,i)=>Math.abs(v-b[i])<1e-10));
});
test('posterior formula and h integrals agree with numerical Bayes quadrature', () => {
  for(const t of [.08,.35,.8])for(const point of [-.7,0,1.4]) {
    const p=posterior(point,t),density=posteriorDensity(point,t);
    assert.ok(Math.abs(density.reduce((a,b)=>a+b,0)*DX-1)<1e-5);
    assert.ok(Math.abs(density.reduce((a,b,i)=>a+b*GRID[i],0)*DX-p.mean)<1e-5);
    for(const kind of ['right','two'] as const){
      const integral=density.reduce((a,b,i)=>a+b*Math.exp(2*reward(GRID[i],kind)),0)*DX;
      assert.ok(Math.abs(integral-posteriorWeight(point,t,2,kind))<1e-4);
    }
  }
  assert.ok(posteriorWeight(0,.35,2,'two')>Math.exp(2*reward(posterior(0,.35).mean,'two'))*100);
});
test('tilt preserves both symmetric modes and normalizes; right tilt shifts within a mode', () => {
  const two=tiltedDensity(3,'two'),right=tiltedDensity(2,'right');
  assert.ok(Math.abs(two.reduce((a,b)=>a+b,0)*DX-1)<1e-12);
  assert.ok(Math.abs(two.reduce((a,b,i)=>a+b*GRID[i],0)*DX)<1e-12);
  assert.ok(right.reduce((a,b,i)=>a+b*GRID[i],0)*DX>2.5);
  assert.ok(Math.abs(BASE.reduce((a,b)=>a+b,0)*DX-1)<1e-6);
});
test('Best-of-N ignores reward scale while importance selection uses it', () => {
  const s=defaults('best');
  assert.deepEqual(selectSamples('best',s).samples,selectSamples('best',{...s,strength:4}).samples);
  assert.notDeepEqual(selectSamples('importance',s).samples,selectSamples('importance',{...s,strength:4}).samples);
  const one=selectSamples('importance',{...s,candidates:1});
  assert.ok(Math.abs(summarize(one.samples).right-.5)<.05);
  assert.equal(one.first.weights[0],1);
});
test('known reverse transition preserves the mixture marginal over several checkpoints', () => {
  const random=seededRandom(50);
  const samples=Array.from({length:12000},()=>{
    // Draw the exact p_1 marginal independently using forward VP corruption.
    const z=Math.sqrt(-2*Math.log(Math.max(1e-12,random())))*Math.cos(2*Math.PI*random());
    let x=(random()<.5?-2:2)*Math.exp(-4)+Math.sqrt(Math.exp(-8)*.55**2+1-Math.exp(-8))*z;
    for(const [a,b] of [[1,.7],[.7,.3],[.3,0]])x=reverseBase(x,a,b,random);
    return x;
  });
  const a=summarize(samples);assert.ok(Math.abs(a.right-.5)<.025);assert.ok(Math.abs(a.sd-Math.sqrt(4+.55**2))<.06);
});
test('SMC stepping has distinct actions, valid parent indices, normalized weights, and conserved population size', () => {
  const state=initializeSMC({...defaults('smc'),particles:12});
  for(let stage=0;stage<state.settings.stages;stage++) {
    assert.equal(state.phase,'propagate');stepSMC(state);assert.equal(state.phase,'weight');
    assert.equal(state.oldH.length,0);stepSMC(state);assert.equal(state.phase,'resample');
    assert.ok(Math.abs(state.weights.reduce((a,b)=>a+b,0)-1)<1e-12);
    stepSMC(state);assert.equal(state.particles.length,12);
    assert.ok(state.history.at(-1)!.parents.every((i)=>i>=0&&i<12));
  }
  assert.equal(state.phase,'done');assert.equal(state.history.at(-1)!.time,0);
});
test('SMC returns one draw per independent population and a misleading H can damage finite M coverage', () => {
  const s={...defaults('smc'),particles:12};
  const good=runSMC(s,600),bad=runSMC({...s,estimator:'misleading'},600);
  assert.equal(good.samples.length,600);assert.equal(good.transitions,600*12*6);
  assert.ok(Math.abs(summarize(good.samples).right-.5)<.09);
  assert.ok(summarize(bad.samples).right>summarize(good.samples).right+.15);
});
test('quantile generator really maps a Normal source into the fixed base mixture', () => {
  const random=seededRandom(12),samples=Array.from({length:5000},()=>generator(Math.sqrt(-2*Math.log(Math.max(1e-12,random())))*Math.cos(2*Math.PI*random())));
  const a=summarize(samples);assert.ok(Math.abs(a.right-.5)<.035);assert.ok(Math.abs(a.sd-Math.sqrt(4+.55**2))<.07);
  assert.ok(mixtureDensity(generator(0))>0);
});
test('MCMC and swap rules obey target ratios, allow lower rewards, and keep rejected states', () => {
  assert.ok(Math.abs(Math.exp(logAcceptance(-1,1,1,0,Math.log(2)))-.5)<1e-12);
  assert.ok(Math.abs(logSwap(0,2,-1,-1))<1e-12);
  assert.ok(Math.abs(Math.exp(logSwap(0,2,0,1))-Math.exp(-2))<1e-12);
  const s=defaults('source'),chain=runChains('source',s),parallel=runChains('tempering',s);
  assert.equal(chain.samples.length,s.steps);assert.equal(chain.trace.length,s.steps);
  assert.ok(chain.rejected>0 && chain.lowerAccepted>0);
  assert.ok(chain.trace.some((row,i)=>i>0&&row[0]===chain.trace[i-1][0]));
  assert.equal(parallel.evaluations,3*chain.evaluations);
  assert.ok(parallel.swaps>0&&parallel.swapAttempts>parallel.swaps);
});
test('all executable examples contain sampling and a plotted empirical distribution', () => {
  for(const mode of ['classifier','cfg','tilt','posterior','best','importance','smc','source','tempering'] as const){const code=steeringPython(mode);assert.ok(code.includes('ax.hist(samples'));assert.ok(code.includes('plt.show()'));assert.ok(code.length<30000);}
});
