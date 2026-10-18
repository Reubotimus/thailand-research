import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const activities=JSON.parse(await readFile(new URL('../data/activities.json',import.meta.url),'utf8'));
const ids=new Set(activities.map(a=>a.id));
assert.equal(activities.length,349,'All report entries must remain in the registry');
assert.equal(ids.size,activities.length,'Activity IDs must be unique');
assert.equal(activities.filter(a=>a.city==='Bangkok').length,177);
assert.equal(activities.filter(a=>a.city==='Chiang Mai').length,172);
function url(value,where){assert.equal(typeof value,'string',where);assert.match(value,/^https?:\/\//,where);new URL(value);}
for(const a of activities){for(const k of ['id','name','city','category','summary','area'])assert.ok(typeof a[k]==='string'&&a[k].trim(),`${a.id}: ${k}`);for(const source of a.reportSources)url(source.url,a.id);}
const dir=new URL('../data/research/',import.meta.url);
const files=(await readdir(dir)).filter(f=>f.endsWith('.json'));
const coverage={verified:0,partial:0,unavailable:0,images:0};
for(const file of files){const r=JSON.parse(await readFile(new URL(file,dir),'utf8'));
 assert.ok(ids.has(r.id),`Unknown research ID ${r.id}`);assert.equal(file,`${r.id}.json`);
 assert.ok(['verified','partial','unavailable'].includes(r.status),`${r.id}: status`);coverage[r.status]++;
 for(const k of ['researchedAt','summary','duration','cost','hours','bestTime','gettingThere','booking','accessibility','decemberNotes'])assert.ok(typeof r[k]==='string'&&r[k].trim(),`${r.id}: ${k}`);
 for(const k of ['whyGo','bestFor','skipIf','practicalTips','uncertainties'])assert.ok(Array.isArray(r[k])&&r[k].every(v=>typeof v==='string'),`${r.id}: ${k}`);
 assert.ok(Array.isArray(r.sources)&&r.sources.length>0,`${r.id}: at least one source`);
 for(const s of r.sources){assert.ok(s.title,`${r.id}: source title`);url(s.url,r.id);}
 assert.ok(Array.isArray(r.images),`${r.id}: images`);
 for(const image of r.images){for(const k of ['alt','credit','license'])assert.ok(typeof image[k]==='string'&&image[k].trim(),`${r.id}: image ${k}`);url(image.url,r.id);url(image.sourceUrl,r.id);coverage.images++;}
}
console.log(JSON.stringify({activities:activities.length,researchBriefs:files.length,pending:activities.length-files.length,...coverage},null,2));
if(process.argv.includes('--complete'))assert.equal(files.length,activities.length,'Independent research is not yet complete');
