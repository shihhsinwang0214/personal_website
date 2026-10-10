/* Finite attention computations shared by the demo and Node checks. */
(function(root) {
  "use strict";
  const dot = (a,b) => a.reduce((s,x,i)=>s+x*b[i],0);
  const project = (h,w) => h.map(row=>w[0].map((_,j)=>row.reduce((s,x,k)=>s+x*w[k][j],0)));
  const permute = (x,p) => p.map(i=>x[i].slice());
  const conjugate = (x,p) => p.map(i=>p.map(j=>x[i][j]));
  const error = (x,y) => Math.max(0,...x.flat().map((v,i)=>Math.abs(v-y.flat()[i])));
  function attention(h, options={}) {
    const n=h.length;
    const input=h.map((row,i)=>row.map((x,j)=>x+(options.positions?.[i]?.[j]||0)));
    const q=project(input,[[1,.3],[-.4,.8]]);
    const k=project(input,[[.7,-.2],[.5,1]]);
    const v=project(input,[[1,.2],[-.3,.9]]);
    const valid=options.valid||Array(n).fill(true);
    const temperature=options.temperature??1;
    if(!(temperature>0))throw new Error("temperature must be positive");
    const scores=q.map((qi,i)=>k.map((kj,j)=>
      (!valid[j]||options.mask?.[i]?.[j])?-Infinity:
      dot(qi,kj)/(Math.sqrt(2)*temperature)+(options.bias?.[i]?.[j]||0)));
    const weights=scores.map((row,i)=>{
      if(!valid[i])return row.map(()=>0);
      const peak=Math.max(...row);
      if(!Number.isFinite(peak))throw new Error("every valid query needs a visible key");
      const exp=row.map(s=>Math.exp(s-peak)),total=exp.reduce((a,b)=>a+b,0);
      return exp.map(x=>x/total);
    });
    const output=weights.map(row=>[0,1].map(c=>dot(row,v.map(x=>x[c]))));
    return {q,k,v,scores,weights,output};
  }
  root.GDLAttention={attention,permute,conjugate,error};
})(globalThis);
