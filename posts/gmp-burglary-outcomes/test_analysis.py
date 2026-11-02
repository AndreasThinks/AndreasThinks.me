import unittest
import numpy as np
import pandas as pd
from analysis import BASE, GMP, OLD, NEW, DOM, aggregate, fit, rate, strict_sum, windows
class AnalysisTests(unittest.TestCase):
 def test_weighted_rate(self):
  p=pd.DataFrame({'quarter':['x','x'],'force':['a','b'],'denominator':[10,90],'charge':[5,9],'unresolved':[1,10],'rate':[50,10]})
  a=aggregate(p,['a','b'],'test').iloc[0]
  self.assertEqual(a.rate,14); self.assertNotEqual(a.rate,30)
 def test_missing_not_zero(self):
  self.assertTrue(np.isnan(strict_sum(pd.Series([1,np.nan]))))
  self.assertTrue(np.isnan(strict_sum(pd.Series([],dtype=float))))
  self.assertTrue(np.isnan(rate(0,0)))
  self.assertEqual(strict_sum(pd.Series([0,0])),0)
 def test_simplex_and_known_solution(self):
  X=np.array([[1,0],[0,1],[2,1]])
  w=fit(X@np.array([.3,.7]),X)
  np.testing.assert_allclose(w,[.3,.7],atol=1e-6)
 def test_split(self):
  idx=pd.period_range('2017Q2','2026Q2',freq='Q'); pre,post=windows(idx)
  self.assertEqual(pre.sum(),12)
  self.assertEqual(post.sum(),15)
  self.assertFalse(pre[idx==pd.Period('2021Q2')].any())
  self.assertFalse(post[idx==pd.Period('2021Q2')].any())
  self.assertFalse(pre[(idx>=pd.Period('2019Q2'))&(idx<=pd.Period('2020Q1'))].any())
  self.assertLess(idx[pre].max(),idx[post].min())
 def test_no_post_leakage(self):
  idx=pd.period_range('2017Q2','2026Q2',freq='Q'); pre,post=windows(idx)
  rng=np.random.default_rng(4); X=rng.random((len(idx),5)); y=rng.random(len(idx))
  w=fit(y[pre],X[pre]); y[post]=1000; X[post]=-100
  np.testing.assert_array_equal(w,fit(y[pre],X[pre]))
 def test_mappings(self):
  codes=pd.read_csv(BASE/'data/codebook.csv'); outcomes=pd.read_csv(BASE/'data/outcome_codes.csv')
  self.assertTrue(outcomes[outcomes.outcome_type==1].outcome.str.lower().str.contains('charged/summonsed').all())
  self.assertTrue(outcomes[outcomes.outcome_type==0].outcome.str.contains('Not yet assigned').all())
  self.assertEqual(len(NEW),10); self.assertEqual(len(OLD),5)
  self.assertFalse(OLD&NEW); self.assertFalse(DOM&OLD)
  for c in OLD|NEW: self.assertTrue(codes[codes.code==c].offence.str.lower().str.contains('residential').all())
 def test_panel_invariants(self):
  p=pd.read_csv(BASE/'data/panel.csv')
  self.assertFalse(p.duplicated(['quarter','force']).any())
  h=p[p.denominator>0]
  self.assertTrue(p.loc[p.denominator<=0,'rate'].isna().all())
  self.assertTrue((h.charge<=h.denominator).all())
  self.assertTrue((h.unresolved<=h.denominator).all())
  self.assertTrue((h.broad>=h.charge).all())
  missing=p[(p.force==GMP)&p.quarter.isin(['2019Q3','2019Q4','2020Q1'])]
  self.assertTrue(missing.denominator.isna().all())
 def test_source_totals(self):
  raw=pd.read_csv(BASE/'data/burglary_raw.csv.gz',keep_default_na=False,low_memory=False)
  h=raw[(raw.force==GMP)&(raw.financial_year=='2020/21')&raw.code.isin(OLD)]
  p=pd.read_csv(BASE/'data/panel.csv'); q=p[(p.force==GMP)&p.quarter.isin(['2020Q2','2020Q3','2020Q4','2021Q1'])]
  self.assertEqual(pd.to_numeric(h.cohort).sum(),q.denominator.sum())
  self.assertEqual(pd.to_numeric(h[h.outcome_type==1].cohort).sum(),q.charge.sum())
if __name__=='__main__': unittest.main(verbosity=2)
