"""Build the Quarto notebook with nbformat; execute separately with execute.py."""
from pathlib import Path
import nbformat as nbf
BASE=Path(__file__).resolve().parent
nb=nbf.v4.new_notebook(); cells=[]
def md(s): cells.append(nbf.v4.new_markdown_cell(s))
def code(s): cells.append(nbf.v4.new_code_cell(s))
def fig(name,caption):
 md(f':::{{.dark-fig}}\n![{caption}](figures/{name}_dark.png)\n:::\n\n:::{{.light-fig}}\n![{caption}](figures/{name}_light.png)\n:::')
cells.append(nbf.v4.new_raw_cell('''---
title: "GMP burglary outcomes: improvement, and the limits of comparison"
description: "An audit of official residential burglary cohorts and a synthetic control that cannot establish causation."
author: Andreas Varotsis
date: 2026-11-02
draft: true
robots: noindex
header-includes:
  - '<meta name="robots" content="noindex">'
categories: [Policing, Data analysis]
toc: true
freeze: true
execute:
  enabled: false
  echo: false
  warning: false
---'''))
md('''## What this analysis can tell us

**This is a descriptive comparison, not evidence that Stephen Watson or burglary attendance caused a change.** The official data contain a major GMP recording break before his appointment. A synthetic control can be calculated, but it cannot repair that break or supply a credible causal estimate.

The question follows my [earlier post on burglary attendance](https://andreasthinks.me/posts/burglary_attendance/): how did recorded residential burglary outcomes change around Watson taking office on 24 May 2021? April–June 2021 is a transition quarter; July–September 2021 is the first full quarter afterwards. These dates are the research brief's intervention definition. National attendance requirements, other reforms, pandemic disruption and changes in crime recording prevent a clean attribution to one person or policy.

I use the Home Office's offence-cohort outcomes, through **April–June 2026**. These files cannot replicate an August 2026 claim. The latest workbook is dated 22 October 2026, but its crimes stop in June. A publication date is not an offence date.''')
code('''from pathlib import Path
import json
import pandas as pd
pd.set_option('display.max_rows', 250)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
from IPython.display import display, Markdown
from analysis import run, BASE, GMP, PEERS
from figures import make_figures
panel, benchmarks, model, results = run()
make_figures(panel, benchmarks, model)
def table(filename, columns=None):
    frame = pd.read_csv(BASE / 'data' / filename)
    display(frame[columns] if columns else frame)
summary = pd.read_csv(BASE / 'data/period_summary.csv')
g = summary[summary.force == GMP].set_index('period')
before, recent = g.loc['Before: 2020/21'], g.loc['2024/25']
display(Markdown(f"For crimes recorded in 2020/21, GMP's charge/summons rate is **{before.rate:.2f}%** ({before.charge:,.0f} of {before.denominator:,.0f}). In 2024/25 it is **{recent.rate:.2f}%** ({recent.charge:,.0f} of {recent.denominator:,.0f}), a change of **{recent.rate-before.rate:+.2f} percentage points**. Both are the outcomes known at their respective workbook snapshots, not measurements at equal follow-up ages."))''')
md('''## What is counted

The numerator is **outcome 1, Charged/Summonsed**. The denominator is the sum across all outcome types, including code 0, **Not yet assigned an outcome**, for the selected offences recorded in that quarter. This is a count of recorded crimes, not victims, suspects, convictions or investigations closed that quarter. A charge is not a conviction. Code 0 is not synonymous with every unsolved crime: a closed case without a suspect has a different outcome code.

The other numeric column in the files counts investigations closed in the quarter. Dividing that flow by new crimes in the same quarter mixes different cohorts. It is retained in the extraction for audit but never used in these rates. “Detection rate” below means the specified cohort charge/summons percentage, not an unspecified solved measure.

Residential burglary includes attempts, distraction burglary and aggravated burglary. From April 2017 to March 2023 I use codes 28E–28H and 29A. From April 2023 I use 28I–28P, 29B and 29C, adding **homes and unconnected buildings together**. The latest workbook notes describe the split. Earlier domestic burglary is retained in the downloadable audit using 28A–28D and 29, but excluded from model fitting because the April 2017 classification widened the residential boundary. Old residential codes still contain 2,673 crimes in 2023/24 nationally. I include those residual 28E–28H/29A counts alongside the new codes after April 2023, because they remain residential crimes in these offence cohorts. The residual counts are audited separately; old domestic codes are not carried into the residential definition.

A secondary “broader disposal” measure sums codes **1, 2, 3, 4, 6, 7 and 8**: charges, youth/adult cautions, taken into consideration, penalty notices, cannabis/khat warnings and community resolutions. It excludes offender death, non-prosecution decisions, diversion code 22 and deferred prosecution codes 23–24. This fixed definition is a sensitivity check, **not a reconstruction of GMP's solved statistic**. The notes record changes in disposal practice and new deferred prosecution codes in April 2026.

Definitions and caveats are transcribed from the cached workbooks' headers, outcome labels and Notes sheets. See the [official data collection](https://www.gov.uk/government/statistical-data-sets/police-recorded-crime-and-outcomes-open-data-tables) and [official user guide](https://www.gov.uk/government/statistics/police-recorded-crime-open-data-tables/police-recorded-crime-and-outcomes-open-data-tables-user-guide). The user guide and data collection page were independently consulted alongside the workbook notes.''')
md('''## Counts, rates and real comparators

I chose the other metropolitan territorial forces as real comparators on institutional/geographic grounds, without selecting on their post-2021 performance: Merseyside, Metropolitan Police, Northumbria, South Yorkshire, West Midlands and West Yorkshire. These are contextual comparisons, not matched or randomly assigned controls. West Midlands has explicit reporting warnings, so the headline peer line excludes it; the full group and individual force results remain visible.

The national benchmark is **all 42 other territorial England and Wales forces**, subject to available valid cells each quarter, excluding GMP and British Transport Police. It is a burglary-count-weighted rate: total charges divided by total recorded residential burglaries, not the average force percentage. It is not an all-crime national charge rate, nor necessarily an exact reproduction of a published national headline. Workbook warnings still apply to the inclusive national benchmark. The tables expose the number of contributing forces; a separate quality-screened benchmark is supplied with the derived data.

The latest quarters have less time for outcomes to be assigned. The main model summary ends at March 2025 to reduce that problem, but this does **not** establish equal maturity. The descriptive table also shows 2025/26 and the newest quarter, with unresolved counts and proportions.''')
code('''display(summary[summary.force.isin([GMP, 'Territorial England and Wales excluding GMP', 'Peer group excluding West Midlands'])].round(3))''')
fig('trends','GMP counts and weighted comparison rates. Grey bands mark the excluded 2019/20 GMP financial year and the 2021 transition quarter. Each point is an offence cohort, with unequal snapshot follow-up.')
fig('comparators','Real comparator force rates. West Midlands is shown for transparency despite the workbook comparability warning; it is excluded from synthetic-control donors.')
code('''display(summary[summary.force.isin(PEERS)].round(3))
display(benchmarks[benchmarks.quarter >= pd.Period('2017Q2')][['quarter','force','n_forces','expected_forces']])''')
md('''## The recording break is central

The 2019/20 Notes sheet says GMP could not supply July 2019–March 2020 data following a new IT system in July 2019, and separately says its cohort outcomes are not up to date or comparable. This is the iOPS-era break identified in the brief. I exclude **all of 2019/20**, including April–June 2019, from fitting and mark it as a gap in figures. The actual extracted cells remain below. Some source outcome-0 cells are negative, including South Yorkshire in 2017/18 and Dyfed-Powys in 2023/24. I preserve these signed source values in the summed denominator; they cannot literally be counts of open investigations. Their cause cannot be established from the cached notes. The negative-cell audit is retained, rates with non-positive denominators are unavailable, and a sensitivity specification makes every negative-cell force-quarter unavailable (excluding affected pre-period donors). No missing values are imputed as zeros and no line is interpolated across the missing model data.

After that exclusion, the comparable residential definition provides eight pre-break quarters (April 2017–March 2019) and just four quarters after the break and before the appointment (April 2020–March 2021). Those four also coincide with the pandemic. Numerical availability after the break does not certify consistent crime recording. Changes in what gets recorded can change both counts and rates even if investigative performance is unchanged.''')
code('''display(panel[(panel.force == GMP) & panel.quarter.between(pd.Period('2018Q2'), pd.Period('2021Q2'))][['quarter','denominator','charge','unresolved','rate','missing_cells','recording_warning']])
table('out_of_era.csv')
negative = pd.read_csv(BASE/'data/negative_cells.csv')
display(negative.groupby(['financial_year','force']).agg(negative_cells=('value','size'),signed_total=('value','sum')))''')
md('''## A synthetic control, with a failed evidence gate

A synthetic control is a weighted mixture of other forces. Weights must be nonnegative and sum to one. I minimise the unweighted mean squared difference between quarterly charge/summons percentages, using only the pre-intervention quarters. There is no intercept, outcome adjustment, post-period weight tuning or demographic matching.

All other forces are considered. British Transport Police is excluded because it is non-territorial. The Notes sheets identify stale/incomplete reporting for Dorset, Devon and Cornwall, Humberside, West Midlands and Leicestershire; these are excluded conservatively. Any remaining force with a missing pre-period rate or zero denominator is also excluded. Post-period performance is not an eligibility criterion. City of London is retained despite its small residential counts; one zero-denominator post quarter is unavailable. Predictions require only donors with positive fitted weights (weights below 1e-8 are set to zero and renormalised). All placebo ratios use the same complete post quarters across their target forces; their `n_post` column records that denominator. The complete exclusion and weight tables follow.

Before interpreting an effect, this analysis requires at least eight consecutive quarters of reliable pre-treatment data under the same recording regime, with at least four held out, and holdout RMSE no worse than 1 percentage point and twice the training RMSE (with a 0.1-point floor). These are conservative analysis rules, not established statistical cutoffs or a preregistration. **GMP fails the recording-continuity requirement regardless of the fitted numbers.** There are only four post-break quarters. A good fit across the break would not repair that failure.

For the main numerical diagnostic I nevertheless fit all 12 available pre quarters and retain the results. The chronological holdout trains on the eight pre-break quarters and predicts the four 2020/21 quarters. It directly tests transport across the recording break, but cannot independently validate the recording regime. A separate short-window specification trains on two quarters and holds out two; this is far too short for causal confidence.''')
code('''table('donor_exclusions.csv')
table('weights.csv')
table('specifications.csv')
display(Markdown(f"The main fit uses **{results['primary']['donors']} donors**. Pre-period RMSE is **{results['primary']['pre_rmse']:.3f} percentage points**; chronological holdout RMSE is **{results['primary']['holdout_rmse']:.3f} points**. The mean July 2021–March 2025 gap is **{results['primary']['post_mean_gap']:+.3f} points**. This is an observed-minus-fitted difference, **not an estimated causal effect**."))''')
fig('synthetic','The actual constrained fit and its gap. The training period crosses a known recording break, so the gap has no secure causal interpretation.')
md('''## How fragile is the comparison?

The specification table contrasts the full available pre-period, pre-break only, post-break only, and the broader disposal outcome. Its equal-weight pre-RMSE is an unoptimised benchmark. All fits use raw quarterly rates and the same documented donor-quality exclusions. Different windows change what is learned; none removes the data problem. With more donors than time points, especially in the two-quarter training window, optimal weights can be non-unique. Near-perfect short-window prefit is not evidence of reliability.

I refit after omitting **every eligible donor one at a time**, including donors with zero original weight. For in-space placebos, each eligible donor becomes the target and is fitted from the remaining donors; GMP is never a donor in those placebo fits. The post/pre RMSE ratio scales gaps by prefit quality. I show all results, then a screen retaining pre-RMSE at most twice GMP's. Rankings include GMP and their denominators. Near-zero prefit can inflate ratios. These are descriptive diagnostics, **not permutation p-values**: forces are not exchangeable or randomly selected for treatment.''')
code('''table('leave_one_donor_out.csv')
table('placebos.csv')
p = results['placebo_gmp']
display(Markdown(f"GMP's fit-normalised rank is **{p['rank_all']:.0f} of {results['placebo_total']}** including GMP, or **{p['rank_screened']:.0f} of {results['placebo_screened']}** after the stated prefit screen. Leave-one-donor-out mean gaps range from **{results['loo_min']:+.3f} to {results['loo_max']:+.3f} percentage points**. These ranges measure specification sensitivity, not a confidence interval."))
table('post_window_sensitivity.csv')''')
fig('placebos','Post/pre RMSE ratios for GMP and all eligible placebo targets. Ranking does not establish exchangeability or causality.')
md('''## Source snapshots and reproducibility

The 13 XLSX files supplied in `source-cache/` were downloaded by the host from official open-data links on 2 November 2026. Every supplied workbook is inspected, including the older domestic-burglary years. The manifest records filenames, SHA-256 hashes, workbook update text, coverage and headers. File naming dates are not assumed to be extraction dates: for example, the 2014/15 workbook says its data are as published in January 2019, despite its later filename. A Notes update date also need not be the force's last data refresh.

Only one supplied snapshot exists for each financial year. Therefore I cannot construct a panel measured a fixed number of months after every cohort, audit revisions between releases, or claim equal maturity across forces. The extracted unresolved proportions help expose this issue but do not correct it. Archived repeated releases would be needed for a consistent-age analysis.

The manifest records the direct attachment URLs verified against the Home Office collection page as well as the filenames and hashes. The [2025/26 technical annex](https://www.gov.uk/government/statistics/crime-outcomes-in-england-and-wales-2025-to-2026/crime-outcomes-in-england-and-wales-technical-annex), linked in workbook notes, is an additional documentary reference for independent review, not a page inspected here.

The compact extracted public data, code and audit outputs live beside this notebook. Full XLSX downloads are not included. `extract.py` rebuilds the data from those workbooks; `analysis.py` rebuilds every table and `figures.py` both theme variants. `build_notebook.py` generates this notebook; it was executed through a Jupyter kernel on the host. The original sandbox could not bind kernel sockets, so `execute.py` provides an in-process alternative. The tests cover weighted rates, missingness, time splits, constrained weights, outcome mapping, source totals and absence of post-treatment fitting leakage. See `_README.md` for exact commands and file roles.''')
code('''manifest = json.loads((BASE/'data/manifest.json').read_text())
display(pd.DataFrame(manifest)[['file','notes_update','years','quarters','burglary_rows','sha256']])
import unittest
suite = unittest.defaultTestLoader.discover(str(BASE), pattern='test_analysis.py')
result = unittest.TextTestRunner(verbosity=2).run(suite)
assert result.wasSuccessful(), 'Analysis checks failed' ''')
md('''## What I would conclude

The observed counts and charge/summons proportions are useful descriptions of what these snapshots contain. They do not isolate the effect of a chief constable, attendance policy or any single reform. The national mandate and bundled changes contaminate comparisons; non-random force selection, recording practices, classification changes, pandemic conditions, differing follow-up and ongoing data revisions all remain plausible explanations for part of any gap.

The synthetic control is retained because failed diagnostics should be visible. It should not be presented as a credible counterfactual, and its gap should not be converted into “extra crimes solved”. Stronger attribution would require a defensible stable pre-period, comparable outcome maturity, and a design that separates simultaneous changes.

**AI assistance:** Codex helped extract the supplied public workbooks, write and execute the analysis, produce diagnostics and draft this text. Independent human review of the data mapping, provenance and interpretation is required before publication. This post remains an unlinked draft with `noindex`.''')
nb.cells=cells; nb.metadata={'kernelspec':{'display_name':'Python (project .venv)','language':'python','name':'python3'},'language_info':{'name':'python','version':'3.14'}}
nbf.validate(nb); nbf.write(nb,BASE/'index.ipynb')
