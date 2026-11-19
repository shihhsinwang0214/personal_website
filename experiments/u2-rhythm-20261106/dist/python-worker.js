let runtime;
const indexURL='https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
self.onmessage=async({data})=>{
 let stdout='',stderr='';
 try{
  if(!runtime){
   self.postMessage({kind:'loading'});
   runtime=import(indexURL+'pyodide.mjs').then(m=>m.loadPyodide({indexURL}));
  }
  const py=await runtime;
  py.setStdout({batched:line=>{if(stdout.length<64000)stdout+=line+'\n';}});
  py.setStderr({batched:line=>{if(stderr.length<8000)stderr+=line+'\n';}});
  self.postMessage({kind:'running'});
  await py.loadPackagesFromImports(data.code);
  const globals=py.toPy({__name__:'__main__'});
  try{const result=await py.runPythonAsync(data.code,{globals});result?.destroy?.();}
  finally{globals.destroy();}
  self.postMessage({kind:'done',stdout,stderr});
 }catch(error){runtime=undefined;self.postMessage({kind:'error',stdout,stderr,error:String(error)});}
};
