"""Offline extraction; preserves raw burglary cells, including missing-value tokens."""
from pathlib import Path
import gzip
import zipfile, xml.etree.ElementTree as ET, csv, json, hashlib
import openpyxl
BASE=Path(__file__).resolve().parent
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
def extract(cache):
 manifest=[]; notes={}
 urls=json.loads((BASE/'data/source_urls.json').read_text())
 with gzip.open(BASE/'data/burglary_raw.csv.gz','wt') as out:
  writer=csv.writer(out); writer.writerow(['source','financial_year','financial_quarter','force','offence','group','subgroup','code','expired','outcome','outcome_group','outcome_type','cohort','flow'])
  for p in sorted(Path(cache).glob('*.xlsx')):
   w=openpyxl.load_workbook(p,read_only=True,data_only=True)
   notes[p.name]=[str(v) for row in w['Notes'].values for v in row if v is not None]
   sheet=[s for s in w if s.max_row>10000]; assert len(sheet)==1
   headers=next(sheet[0].values); assert 'offences' in headers[11].lower() and 'quarter' in headers[11].lower()
   n=0; years=set(); quarters=set()
   with zipfile.ZipFile(p) as z:
    ss=ET.fromstring(z.read('xl/sharedStrings.xml')); strings=[''.join(e.itertext()) for e in ss]; del ss
    ids={str(i) for i,s in enumerate(strings) if 'burglary' in s.lower()}
    idx=w.sheetnames.index(sheet[0].title)+1
    with z.open(f'xl/worksheets/sheet{idx}.xml') as f:
     for _,row in ET.iterparse(f,events=['end']):
      if row.tag!=NS+'row': continue
      cells=list(row)
      matches=any(c.attrib.get('r','').startswith('D') and c.attrib.get('t')=='s' and c.findtext(NS+'v') in ids for c in cells)
      if matches:
       vals=['']*13
       for c in cells:
        col=''.join(x for x in c.attrib['r'] if x.isalpha()); j=ord(col)-65 if len(col)==1 else 99
        if j<13:
         v=c.findtext(NS+'v',''); vals[j]=strings[int(v)] if c.attrib.get('t')=='s' else v
       writer.writerow([p.name]+vals); n+=1; years.add(vals[0]); quarters.add(vals[1])
      row.clear()
   manifest.append(dict(file=p.name,sha256=hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),bytes=p.stat().st_size,years=sorted(years),quarters=sorted(quarters),burglary_rows=n,headers=headers,notes_update=next((t for t in notes[p.name] if t.lower().startswith('updated')),None),source_page='https://www.gov.uk/government/statistical-data-sets/police-recorded-crime-and-outcomes-open-data-tables',download_date='2026-11-02',attachment_url=urls.get(p.name)))
   w.close(); print(p.name,n,flush=True)
 (BASE/'data/manifest.json').write_text(json.dumps(manifest,indent=2))
 (BASE/'data/workbook_notes.json').write_text(json.dumps(notes,indent=2))
if __name__=='__main__':
 import sys
 extract(sys.argv[1] if len(sys.argv)>1 else BASE.parents[1]/'source-cache')
