from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from analysis import BASE,GMP,PEERS

def make_figures(panel,benchmarks,model):
 for theme in ['dark','light']:
  dark=theme=='dark'; bg='#1a1a2e' if dark else 'white'; fg='#e0e0e0' if dark else '#1a1a2e'
  plt.rcParams.update({'figure.facecolor':bg,'axes.facecolor':'#16213e' if dark else '#f8f9fa','text.color':fg,'axes.labelcolor':fg,'xtick.color':fg,'ytick.color':fg,'axes.edgecolor':fg,'font.size':10})
  def save(fig,name):
   fig.tight_layout(); fig.savefig(BASE/f'figures/{name}_{theme}.png',dpi=150); plt.close(fig)
  g=panel[(panel.force==GMP)&(panel.quarter>=pd.Period('2017Q2'))].copy()
  # Show the flagged financial year as a gap, with raw cells retained in audit tables.
  g.loc[g.recording_warning,['denominator','charge','rate','unresolved_rate']]=float('nan')
  fig,axs=plt.subplots(2,2,figsize=(12,8))
  for ax,col,title in zip(axs.flat,['denominator','charge','rate','unresolved_rate'],['Recorded residential burglaries','Charge/summons outcomes','Charge/summons (% of recorded crimes)','Not yet assigned an outcome (%)']):
   ax.plot(g.quarter.dt.to_timestamp(),g[col],color='#00d4ff' if dark else '#1d6fa4',label='GMP',lw=2)
   if col in ['rate','unresolved_rate']:
    for name,color in [('Territorial England and Wales excluding GMP','#ff6b6b' if dark else '#cc3333'),('Peer group excluding West Midlands','#00ff9f' if dark else '#2a9d5c')]:
     h=benchmarks[(benchmarks.force==name)&(benchmarks.quarter>=pd.Period('2017Q2'))]
     ax.plot(h.quarter.dt.to_timestamp(),h[col],label=name,color=color,alpha=.8)
   ax.axvspan(pd.Timestamp('2021-04-01'),pd.Timestamp('2021-07-01'),color='grey',alpha=.25)
   ax.axvspan(pd.Timestamp('2019-04-01'),pd.Timestamp('2020-04-01'),color='grey',alpha=.15)
   ax.set_title(title); ax.grid(alpha=.15); ax.tick_params(axis='x',rotation=30)
  axs[1,0].legend(fontsize=7); fig.suptitle('Observed cohort outcomes; snapshots have unequal follow-up',fontsize=14)
  save(fig,'trends')
  fig,ax=plt.subplots(figsize=(11,5))
  for f in [GMP]+PEERS:
   h=panel[(panel.force==f)&(panel.quarter>=pd.Period('2017Q2'))].copy()
   h.loc[h.recording_warning,'rate']=float('nan')
   ax.plot(h.quarter.dt.to_timestamp(),h.rate,label=f,lw=2.5 if f==GMP else 1,alpha=1 if f==GMP else .65)
  ax.axvspan(pd.Timestamp('2021-04-01'),pd.Timestamp('2021-07-01'),color='grey',alpha=.25)
  ax.set_ylabel('Charge/summons (%)'); ax.set_title('Named metropolitan comparators (West Midlands carries reporting warnings)'); ax.legend(ncol=3,fontsize=8); ax.grid(alpha=.15)
  save(fig,'comparators')
  fig,axs=plt.subplots(2,1,figsize=(11,7),sharex=True)
  index=model['wide'].index; valid=index>=pd.Period('2017Q2')
  for series,label in [(model['wide'][GMP],'GMP'),(model['synthetic'],'Synthetic (diagnostic only)')]:
   s=series.copy(); s.loc[(index>=pd.Period('2019Q2'))&(index<=pd.Period('2020Q1'))]=float('nan')
   axs[0].plot(index[valid].to_timestamp(),s[valid],label=label)
  gap=model['gap'].copy(); gap.loc[(index>=pd.Period('2019Q2'))&(index<=pd.Period('2020Q1'))]=float('nan')
  axs[1].plot(index[valid].to_timestamp(),gap[valid]); axs[1].axhline(0,color=fg,lw=.7)
  for ax in axs:
   ax.axvspan(pd.Timestamp('2021-04-01'),pd.Timestamp('2021-07-01'),color='grey',alpha=.25); ax.grid(alpha=.15)
  axs[0].legend(); axs[0].set_ylabel('Charge/summons (%)'); axs[1].set_ylabel('GMP minus synthetic (pp)')
  axs[0].set_title('Synthetic control fails the recording-continuity evidence gate')
  save(fig,'synthetic')
  p=pd.read_csv(BASE/'data/placebos.csv').sort_values('ratio')
  fig,ax=plt.subplots(figsize=(10,8)); ax.barh(p.force,p.ratio,color=['#ff6b6b' if f==GMP else '#888899' for f in p.force]); ax.set_xlabel('Post RMSE / pre RMSE (not a p-value)'); ax.set_title('In-space placebos: all eligible forces, no fit screening in this plot'); ax.tick_params(axis='y',labelsize=8); save(fig,'placebos')
