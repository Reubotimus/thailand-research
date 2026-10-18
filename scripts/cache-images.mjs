// Cache source-linked research reference photos once, keep their credits in the research briefs.
import { readdir, readFile, mkdir, writeFile, rename, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
const run=promisify(execFile),root=process.cwd();
const manifest=path.join(root,'data/image-cache.json');
let cache={};try{cache=JSON.parse(await readFile(manifest,'utf8'));}catch{}
await mkdir(path.join(root,'public/images/activities'),{recursive:true});
const files=(await readdir('data/research')).filter(f=>f.endsWith('.json'));
const jobs=[];const seen=new Set();
for(const file of files){const r=JSON.parse(await readFile(path.join('data/research',file),'utf8'));
 for(const [i,p] of r.images.entries()){
  if(!/^https:\/\//.test(p.url)||seen.has(p.url))continue;
  seen.add(p.url);if(cache[p.url]){try{await access(path.join(root,'public',cache[p.url]));continue;}catch{}}
  jobs.push({url:p.url,id:r.id,index:i});
 }
}
let good=0,failed=0;const failures=[];
async function worker(){while(jobs.length){const job=jobs.shift();const local=`/images/activities/${job.id}-${job.index}.jpg`;const destination=path.join(root,'public',local);const tmp=path.join('/tmp',`thailand-photo-${job.id}-${job.index}`);
 try{
  const download = url => run('curl',['-L','--fail','--silent','--show-error','--max-time','25','--max-filesize','16000000',url,'-o',tmp],{timeout:28000,maxBuffer:5000});
  try { await download(job.url); }
  catch(error) {
    const match = job.url.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([^?]+)$/);
    if (!match || match[1].startsWith('thumb/')) throw error;
    const filename = match[1].split('/').at(-1);
    await download(`https://upload.wikimedia.org/wikipedia/commons/thumb/${match[1]}/1280px-${filename}`);
  }
  await run('sips',['-s','format','jpeg','-s','formatOptions','72','--resampleHeightWidthMax','1000',tmp,'--out',destination],{timeout:15000});
  cache[job.url]=local;good++;
 }catch(error){failed++;failures.push({id:job.id,url:job.url,error:String(error.stderr||error.message).slice(0,250)});}
}}
await Promise.all(Array.from({length:4},worker));
await writeFile(manifest+'.tmp',JSON.stringify(cache,null,2)+'\n');await rename(manifest+'.tmp',manifest);
await writeFile(path.join(root,'data/image-failures.json'),JSON.stringify(failures,null,2)+'\n');
console.log(JSON.stringify({downloaded:good,unavailable:failed,cachedTotal:Object.keys(cache).length}));
