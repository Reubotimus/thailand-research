import {readFile,readdir,writeFile,rename} from 'node:fs/promises';
const activities=JSON.parse(await readFile('data/activities.json','utf8'));
const completed=new Set((await readdir('data/research')).filter(f=>f.endsWith('.json')).map(f=>f.slice(0,-5)));
const running=process.argv.slice(2).filter(id=>!completed.has(id));
const available=activities.filter(a=>!completed.has(a.id)&&!running.includes(a.id));
const cities=[...new Set(activities.map(a=>a.city))];
const queues=cities.map(city=>available.filter(a=>a.city===city).map(a=>a.id));
const pending=[];
while(queues.some(queue=>queue.length)){
 for(const queue of queues){const id=queue.shift();if(id)pending.push(id);}
}
const result={pending,running,completed:activities.map(a=>a.id).filter(id=>completed.has(id)),failed:[]};
await writeFile('data/research-progress.json.tmp',JSON.stringify(result,null,2)+'\n');await rename('data/research-progress.json.tmp','data/research-progress.json');
console.log(JSON.stringify({completed:completed.size,running:running.length,pending:pending.length}));
