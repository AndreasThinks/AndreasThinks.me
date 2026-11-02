"""Reproducible descriptive analysis. All fitting uses pre-intervention outcomes only."""
from pathlib import Path
import json
import numpy as np
import pandas as pd
from scipy.optimize import minimize
BASE=Path(__file__).resolve().parent
GMP='Greater Manchester'
OLD={'28E','28F','28G','28H','29A'}
NEW={'28I','28J','28K','28L','28M','28N','28O','28P','29B','29C'}
DOM={'28A','28B','28C','28D','29'}
PEERS=['Merseyside','Metropolitan Police','Northumbria','South Yorkshire','West Midlands','West Yorkshire']
EXCLUDE={'British Transport Police':'Non-territorial transport force', 'Dorset':'2018/19 notes: last refreshed January 2022', 'Devon and Cornwall':'2020/21 notes: cohort outcomes not comparable', 'Humberside':'2020/21 and later notes: cohort outcomes not comparable', 'West Midlands':'2019/20 and 2020/21 notes: cohort outcomes not comparable', 'Leicestershire':'2020/21 notes: missing outcome 22, denominator concern'}

def strict_sum(s):
 return s.sum() if len(s) and s.notna().all() else np.nan

def rate(n,d):
 return 100*n/d if pd.notna(d) and d>0 else np.nan

def load_panel():
 path=BASE/'data/burglary_raw.csv.gz'
 raw=pd.read_csv(path,keep_default_na=False,dtype={'code':str},low_memory=False)
 raw['value']=pd.to_numeric(raw.cohort,errors='coerce')
 raw['year']=raw.financial_year.str[:4].astype(int)
 raw['quarter']=pd.PeriodIndex.from_fields(year=raw.year+(raw.financial_quarter==4).astype(int),quarter=raw.financial_quarter%4+1,freq='Q')
 raw['selected']=((raw.quarter<pd.Period('2017Q2'))&raw.code.isin(DOM)) | (raw.quarter.between(pd.Period('2017Q2'),pd.Period('2023Q1'))&raw.code.isin(OLD)) | ((raw.quarter>=pd.Period('2023Q2'))&raw.code.isin(OLD|NEW))
 raw[['source','code','offence','subgroup','expired']].drop_duplicates().to_csv(BASE/'data/codebook.csv',index=False)
 raw[['source','outcome_type','outcome','outcome_group']].drop_duplicates().to_csv(BASE/'data/outcome_codes.csv',index=False)
 era=raw[(raw.quarter>=pd.Period('2023Q2'))&raw.code.isin(OLD)].groupby(['financial_year','code']).agg(numeric_total=('value','sum'),missing_cells=('value',lambda s:s.isna().sum())).reset_index()
 era[era.numeric_total!=0].to_csv(BASE/'data/out_of_era.csv',index=False)
 expected_types=raw.groupby('source').outcome_type.agg(lambda s:set(s)).to_dict()
 x=raw[raw.selected].copy()
 x[x.value<0].to_csv(BASE/'data/negative_cells.csv',index=False)
 assert not x.duplicated(['quarter','force','code','outcome_type']).any()
 rows=[]
 for (q,f),g in x.groupby(['quarter','force']):
  expected=DOM if q<pd.Period('2017Q2') else OLD if q<pd.Period('2023Q2') else OLD|NEW
  codes_ok=set(g.code)==expected
  # Every selected offence must have each outcome type present in its source snapshot.
  types=expected_types[g.source.iloc[0]]
  complete=codes_ok and all(set(h.outcome_type)==types for _,h in g.groupby('code'))
  n=strict_sum(g.value) if complete else np.nan
  charge=strict_sum(g.loc[g.outcome_type==1,'value'])
  unresolved=strict_sum(g.loc[g.outcome_type==0,'value'])
  broad=strict_sum(g.loc[g.outcome_type.isin([1,2,3,4,6,7,8]),'value'])
  rows.append(dict(quarter=str(q),force=f,source=g.source.iloc[0],denominator=n,charge=charge,unresolved=unresolved,broad=broad,rate=rate(charge,n),unresolved_rate=rate(unresolved,n),broad_rate=rate(broad,n),negative_cells=int((g.value<0).sum()),missing_cells=int(g.value.isna().sum()),rows=len(g),complete=complete))
 panel=pd.DataFrame(rows)
 panel['quarter']=pd.PeriodIndex(panel.quarter,freq='Q')
 # Reindex absent force-quarters: absence is not a zero.
 grid=pd.MultiIndex.from_product([pd.period_range('2014Q2','2026Q2',freq='Q'),sorted(raw.force.unique())],names=['quarter','force'])
 panel=panel.set_index(['quarter','force']).reindex(grid).reset_index()
 panel['recording_warning']=(panel.force==GMP)&panel.quarter.between(pd.Period('2019Q2'),pd.Period('2020Q1'))
 panel.to_csv(BASE/'data/panel.csv',index=False)
 return panel,raw

def aggregate(panel,forces,label):
 rows=[]
 for q,g in panel[panel.force.isin(forces)].groupby('quarter'):
  valid=g.denominator.notna() & (g.denominator>0) & g.rate.notna()
  h=g[valid]; n=h.denominator.sum() if len(h) else np.nan
  a=h.charge.sum() if len(h) else np.nan
  u=h.unresolved.sum() if len(h) else np.nan
  rows.append(dict(quarter=q,force=label,denominator=n,charge=a,unresolved=u,rate=rate(a,n),unresolved_rate=rate(u,n),n_forces=len(h),expected_forces=len(forces)))
 return pd.DataFrame(rows)

def fit(y,X):
 y=np.asarray(y,float); X=np.asarray(X,float)
 assert len(y)==len(X) and np.isfinite(y).all() and np.isfinite(X).all()
 k=X.shape[1]; assert k>0
 scale=max(1.,float(np.max(np.abs(X))),float(np.max(np.abs(y)))); y=y/scale; X=X/scale
 res=minimize(lambda w: np.mean((y-X@w)**2),np.ones(k)/k,jac=lambda w: -2*X.T@(y-X@w)/len(y),bounds=[(0,1)]*k,constraints={'type':'eq','fun':lambda w:w.sum()-1,'jac':lambda w:np.ones(k)},method='SLSQP',options={'ftol':1e-12,'maxiter':3000})
 if not res.success: raise RuntimeError(res.message)
 assert res.x.min()>-1e-8 and abs(res.x.sum()-1)<1e-8
 w=res.x.copy(); w[w<1e-8]=0; w/=w.sum()
 return w

def predict(X,w):
 active=w>0
 return X.loc[:,active]@w[active]

def rmse(x): return float(np.sqrt(np.mean(np.asarray(x)**2)))
def windows(index,start='2017Q2'):
 pre=(index>=pd.Period(start))&(index<=pd.Period('2021Q1'))&~((index>=pd.Period('2019Q2'))&(index<=pd.Period('2020Q1')))
 post=(index>=pd.Period('2021Q3'))&(index<=pd.Period('2025Q1'))
 return pre,post

def model(panel,metric='rate',start='2017Q2',end='2021Q1'):
 wide=panel.pivot(index='quarter',columns='force',values=metric)
 pre,post=windows(wide.index,start); pre &= wide.index<=pd.Period(end)
 train=pre&(wide.index<=pd.Period('2019Q1')); hold=pre&(wide.index>=pd.Period('2020Q2'))
 if start=='2020Q2':
  train=pre&(wide.index<=pd.Period('2020Q3')); hold=pre&(wide.index>=pd.Period('2020Q4'))
 donors=[]; exclusions=[]
 for f in wide.columns:
  if f==GMP: continue
  reason=EXCLUDE.get(f)
  # Eligibility uses pre-period availability only, not post outcomes.
  if not reason and not wide.loc[pre,f].notna().all(): reason='Incomplete pre-period rate or zero denominator'
  if reason: exclusions.append(dict(force=f,reason=reason))
  else: donors.append(f)
 y=wide[GMP]; X=wide[donors]
 assert y[pre].notna().all()
 w=fit(y[pre],X[pre]); synthetic=predict(X,w)
 # Do not manufacture complete predictions when any donor value is absent.
 synthetic[X.loc[:,w>0].isna().any(axis=1)]=np.nan
 gap=y-synthetic
 if train.sum() and hold.sum():
  wt=fit(y[train],X[train]); hold_rmse=rmse(y[hold]-predict(X[hold],wt)); train_rmse=rmse(y[train]-predict(X[train],wt))
 else: hold_rmse=None; train_rmse=None
 usable=post & gap.notna().to_numpy()
 stats=dict(metric=metric,start=start,end=end,n_pre=int(pre.sum()),n_train=int(train.sum()),n_holdout=int(hold.sum()),donors=len(donors),pre_rmse=rmse(gap[pre]),holdout_rmse=hold_rmse,training_rmse=train_rmse,equal_weight_pre_rmse=rmse(y[pre]-X[pre].mean(axis=1)),post_mean_gap=float(gap[usable].mean()),post_rmse=rmse(gap[usable]),n_post=int(usable.sum()))
 return dict(wide=wide,donors=donors,w=w,pre=pre,post=post,synthetic=synthetic,gap=gap,stats=stats,exclusions=exclusions)

def run():
 panel,raw=load_panel()
 forces=sorted(set(panel.force)-{GMP,'British Transport Police'})
 aggregates=pd.concat([aggregate(panel,forces,'Territorial England and Wales excluding GMP'),aggregate(panel,PEERS,'Metropolitan peer group'),aggregate(panel,[f for f in PEERS if f!='West Midlands'],'Peer group excluding West Midlands')],ignore_index=True)
 quality=aggregate(panel,[f for f in forces if f not in EXCLUDE],'Quality-screened territorial benchmark')
 quality.to_csv(BASE/'data/quality_benchmark.csv',index=False)
 aggregates.to_csv(BASE/'data/benchmarks.csv',index=False)
 gmp=panel[panel.force==GMP]; gmp.to_csv(BASE/'data/gmp_audit.csv',index=False)
 m=model(panel); pd.DataFrame(m['exclusions']).to_csv(BASE/'data/donor_exclusions.csv',index=False)
 pd.DataFrame({'force':m['donors'],'weight':m['w']}).sort_values('weight',ascending=False).to_csv(BASE/'data/weights.csv',index=False)
 stats=[m['stats']]
 for metric,start,end in [('rate','2017Q2','2019Q1'),('rate','2020Q2','2021Q1'),('broad_rate','2017Q2','2021Q1')]: stats.append(model(panel,metric,start,end)['stats'])
 clean=panel.copy(); clean.loc[clean.negative_cells>0,'rate']=np.nan
 clean_stats=model(clean)['stats']; clean_stats['metric']='rate (negative-cell quarters unavailable)'
 stats.append(clean_stats)
 pd.DataFrame(stats).to_csv(BASE/'data/specifications.csv',index=False)
 post_sensitivity=[]
 for a,b in [('2021Q3','2023Q1'),('2021Q3','2025Q1'),('2021Q3','2026Q1'),('2021Q3','2026Q2')]:
  mask=(m['gap'].index>=pd.Period(a))&(m['gap'].index<=pd.Period(b))
  post_sensitivity.append(dict(start=a,end=b,n=m['gap'][mask].notna().sum(),mean_gap=m['gap'][mask].mean()))
 pd.DataFrame(post_sensitivity).to_csv(BASE/'data/post_window_sensitivity.csv',index=False)
 series=pd.DataFrame({'gmp':m['wide'][GMP],'synthetic':m['synthetic'],'gap':m['gap']}); series.to_csv(BASE/'data/synthetic_series.csv')
 # Every eligible donor is removed once, including zero-weight donors.
 loo=[]
 for excluded in m['donors']:
  ds=[d for d in m['donors'] if d!=excluded]; X=m['wide'][ds]; y=m['wide'][GMP]
  w=fit(y[m['pre']],X[m['pre']]); gap=y-predict(X,w); mask=m['post']&gap.notna().to_numpy()
  loo.append(dict(omitted=excluded,pre_rmse=rmse(gap[m['pre']]),post_mean_gap=gap[mask].mean(),n_post=int(mask.sum())))
 pd.DataFrame(loo).to_csv(BASE/'data/leave_one_donor_out.csv',index=False)
 # In-space placebo fits: each donor is treated once, GMP never enters their donor pools.
 placebo=[]
 common_post=m['post']&m['wide'][[GMP]+m['donors']].notna().all(axis=1).to_numpy()
 for target in [GMP]+m['donors']:
  ds=[d for d in m['donors'] if d!=target]; X=m['wide'][ds]; y=m['wide'][target]
  w=fit(y[m['pre']],X[m['pre']]); gap=y-predict(X,w); mask=m['post']&gap.notna().to_numpy()
  mask=common_post
  pr=rmse(gap[m['pre']]); po=rmse(gap[mask]); placebo.append(dict(force=target,pre_rmse=pr,post_rmse=po,ratio=po/pr if pr>1e-8 else np.nan,post_mean_gap=gap[mask].mean(),n_post=int(mask.sum())))
 placebo=pd.DataFrame(placebo); placebo['passes_prefit_screen']=placebo.pre_rmse<=2*m['stats']['pre_rmse']
 placebo['rank_all']=placebo.ratio.rank(ascending=False,method='min'); placebo['rank_screened']=placebo.loc[placebo.passes_prefit_screen,'ratio'].rank(ascending=False,method='min')
 placebo.to_csv(BASE/'data/placebos.csv',index=False)
 # Descriptive before/after blocks are sums of counts, never means of rates.
 combined=pd.concat([panel[panel.force.isin([GMP]+PEERS)],aggregates],ignore_index=True)
 summaries=[]
 for label,a,b in [('Before: 2020/21','2020Q2','2021Q1'),('First full year','2021Q3','2022Q2'),('2024/25','2024Q2','2025Q1'),('2025/26','2025Q2','2026Q1'),('Latest quarter','2026Q2','2026Q2')]:
  for f,g in combined[combined.quarter.between(pd.Period(a),pd.Period(b))].groupby('force'):
   n=strict_sum(g.denominator); c=strict_sum(g.charge); u=strict_sum(g.unresolved)
   summaries.append(dict(period=label,force=f,denominator=n,charge=c,unresolved=u,rate=rate(c,n),unresolved_rate=rate(u,n)))
 pd.DataFrame(summaries).to_csv(BASE/'data/period_summary.csv',index=False)
 info=dict(primary=m['stats'],gate='FAIL: only four post-break pre-treatment quarters; recording continuity and equal cohort maturity unverified',placebo_total=len(placebo),placebo_screened=int(placebo.passes_prefit_screen.sum()),placebo_gmp=placebo[placebo.force==GMP].to_dict('records')[0],loo_min=float(min(r['post_mean_gap'] for r in loo)),loo_max=float(max(r['post_mean_gap'] for r in loo)))
 (BASE/'data/results.json').write_text(json.dumps(info,indent=2))
 return panel,aggregates,m,info

if __name__=='__main__':
 _,_,_,info=run(); print(json.dumps(info,indent=2))
