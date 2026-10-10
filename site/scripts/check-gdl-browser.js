async (page) => {
  const slugs = ["map-view-invariance-equivariance","gdl-g1-1-group-actions","cnn-translation-equivariance-from-map-views","gdl-g1-3-equivariant-networks","gdl-g1-4-boundaries-and-augmentation","gdl-g1-5-translation-lab","rotation-and-group-equivariant-cnns","gdl-g2-2-group-convolution","gdl-g2-3-feature-types","gdl-g2-4-readout-and-discretization","gdl-g2-5-rotation-lab","sets-and-point-clouds-permutation-invariance","gdl-g3-1-deep-sets","gdl-g3-2-set-equivariant-layers","gdl-g3-3-pointnet","gdl-g4-0-attention-from-sets","gdl-g3-4-set-attention","gdl-g4-3-transformer-block","gdl-g4-4-order-and-position","gdl-g4-5-relations-and-masks","gdl-g3-5-set-lab","gnn-permutation-equivariance-road-networks","gdl-g4-2-gcn","gdl-g4-3-aggregation-and-gin","gdl-g4-4-expressivity","gdl-g4-5-graph-lab","euclidean-equivariant-gnns-point-clouds","gdl-g5-2-egnn","gdl-g5-3-energy-and-forces","frontiers-of-equivariant-learning","gdl-g5-5-geometry-lab"];
  const url = new URL(page.url());
  const batch = Number(url.searchParams.get('qa')) || 0;
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const reports = [];
  const selected = url.searchParams.get('qa') === 'all' ? slugs : slugs.slice(batch * 6, batch * 6 + 6);
  for (const slug of selected) {
    const response = await page.goto('http://localhost:4321/personal_website/zh/notes/' + slug, {waitUntil:'domcontentloaded'});
    const frame = page.locator('iframe.demo-frame');
    await frame.scrollIntoViewIfNeeded();
    await page.locator('figure img').first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('figure img')].every(x=>x.complete && x.naturalWidth>0));
    const state = await page.evaluate(() => ({title: document.title, mathErrors: document.querySelectorAll('.katex-error').length, figures:[...document.querySelectorAll('figure img')].length, width:document.documentElement.scrollWidth, viewport:innerWidth, next:[...document.querySelectorAll('a')].filter(a=>a.textContent.includes('下一篇')).map(a=>a.getAttribute('href'))}));
    const demo = page.frames().find(f=>/symmetry-workbench|attention-workbench/.test(f.url()));
    if (demo) {
      await demo.waitForFunction(() => Boolean(window.gdlTestState));
      state.demo = await demo.evaluate(() => ({...window.gdlTestState, width:document.documentElement.scrollWidth, viewport:innerWidth, height:document.documentElement.scrollHeight}));
    }
    reports.push({slug, status:response.status(), ...state});
    if(response.status()!==200||state.mathErrors||state.width>state.viewport+1)throw new Error(JSON.stringify(reports.at(-1)));
  }
  if(errors.length)throw new Error(errors.join('\n'));
  return reports;
}

