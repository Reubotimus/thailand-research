"""Find actual reusable Commons photos: python3 scripts/find-image.py 'Wat Arun' [limit]."""
import sys,json,subprocess,urllib.parse,re
q=sys.argv[1]; limit=int(sys.argv[2]) if len(sys.argv)>2 and sys.argv[2].isdigit() else 2
url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(dict(action='query',generator='search',gsrsearch=q+' filetype:bitmap',gsrnamespace=6,gsrlimit=limit,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=960,format='json'))
if '--url' in sys.argv:
 print(url);sys.exit()
if '--parse' in sys.argv:
 from pathlib import Path
 raw=Path(sys.argv[-1]).read_text()
else:
 r=subprocess.run(['curl','-L','--max-time','20','--retry','1','-s',url],capture_output=True,text=True)
 raw=r.stdout
try:data=json.loads(raw)
except Exception:print('[]');sys.exit()
images=[]
for p in sorted(data.get('query',{}).get('pages',{}).values(),key=lambda p:p.get('index',0)):
 i=p.get('imageinfo',[{}])[0];m=i.get('extmetadata',{})
 def clean(k):return re.sub('<[^>]*>','',m.get(k,{}).get('value','')).strip()
 images.append(dict(url=i.get('thumburl',i.get('url','')).split('?')[0],sourceUrl=i.get('descriptionurl',''),alt=p['title'].removeprefix('File:'),credit=clean('Artist'),license=clean('LicenseShortName')))
print(json.dumps(images,ensure_ascii=False,indent=2))
