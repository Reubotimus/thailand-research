import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import activities from '../data/activities.json';
import type { Activity, Research } from '../data/types';
import Registry from './registry';
export default async function Home() {
  const directory = path.join(process.cwd(), 'data/research');
  const files = (await readdir(directory)).filter(file => file.endsWith('.json'));
  const research: Research[] = [];
  for (const file of files) {
    research.push(JSON.parse(await readFile(path.join(directory, file), 'utf8')) as Research);
  }
  let cache: Record<string,string> = {};
  try { cache = JSON.parse(await readFile(path.join(process.cwd(), 'data/image-cache.json'), 'utf8')); } catch {}
  const withLocalImages = research.map(r => ({...r, images: r.images.map(image => ({...image, url: cache[image.url] || image.url}))}));
  return <Registry activities={activities as unknown as Activity[]} research={withLocalImages} />;
}
