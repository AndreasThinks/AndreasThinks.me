"""Independent openpyxl cross-check of XML extraction for latest GMP cohort."""
from pathlib import Path
import json
import openpyxl
import pandas as pd
from analysis import BASE, NEW, OLD, GMP
p=BASE.parents[1]/'source-cache/prc-outcomes-open-data-jun2026-tables-221026.xlsx'
w=openpyxl.load_workbook(p,read_only=True,data_only=True)
s=w[w.sheetnames[-1]]
counts={'denominator':0,'charge':0,'unresolved':0}; rows=0
for r in s.iter_rows(min_row=2,values_only=True):
 if r[2]==GMP and r[6] in NEW|OLD:
  assert isinstance(r[11],(int,float)); rows+=1; counts['denominator']+=r[11]
  if r[10]==1: counts['charge']+=r[11]
  if r[10]==0: counts['unresolved']+=r[11]
x=pd.read_csv(BASE/'data/burglary_raw.csv.gz',keep_default_na=False,low_memory=False)
x=x[(x.source==p.name)&(x.force==GMP)&x.code.isin(NEW|OLD)]
assert rows==len(x)
assert counts['denominator']==pd.to_numeric(x.cohort).sum()
for col,t in [('charge',1),('unresolved',0)]: assert counts[col]==pd.to_numeric(x[x.outcome_type==t].cohort).sum()
result={'file':p.name,'force':GMP,'selected_rows':rows,**counts,'independent_openpyxl_check':'passed'}
(BASE/'data/source_crosscheck.json').write_text(json.dumps(result,indent=2)); print(result)
