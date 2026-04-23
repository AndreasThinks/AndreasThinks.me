# Data Sources and Methodology

## Direct Sources (Verified Year-by-Year Data)

### 1. Hansard Parliamentary Written Answers — 15 December 2000
**URL:** https://publications.parliament.uk/pa/cm200001/cmhansrd/vo001215/text/01215w11.htm

Provides complete pay scales effective 1 September 2000 for all ranks:
- **Constable:** £17,133 (start) — £27,114 (top)
- **Sergeant:** £26,169 (start) — £30,522 (top)
- **Inspector:** £33,849 (start) — £37,830 (top)
- **Superintendent:** £46,038 (start) — £57,150 (top)
- Also includes London Weighting (£1,713) and London Allowance (£4,338) figures

### 2. Police Federation — Pay Scales 2024/2025
**Constable:** https://polfed.org/resources/pay-scales/constable-pay-scales/
**Sergeant:** https://polfed.org/resources/pay-scales/sergeant-pay-scales/
**Inspector:** https://polfed.org/resources/pay-scales/inspector-pay-scales/

Official scales effective 1 September 2024 and 1 September 2025:
- **Constable (post-2013):** £29,907 → £31,164 (2024 → 2025)
- **Constable (pre-2013):** £31,497 → £32,820 (2024 → 2025)
- **Sergeant:** £51,408 → £53,568 (2024 → 2025)
- **Inspector (outside London):** £61,197 → £63,768 (2024 → 2025)
- **Chief Inspector (outside London):** £67,509 → £70,344 (2024 → 2025)

### 3. Points2Prove — Police Pay Points Guide (2025/26)
**URL:** https://points2prove.co.uk/guidance/police-pay-points

Comprehensive guide effective 1 September 2025 covering all ranks with monthly equivalents:
- **Constable:** £31,164 (start, post-2013) — £50,256 (top)
- **Sergeant:** £53,568 (start) — £56,208 (top)
- **Inspector:** £63,768 (start, outside London) — £68,982 (top)
- **Superintendent:** £84,177 (start) — £99,015 (top)
- **Chief Superintendent:** £103,797 (start) — £115,785 (top)
- Also lists allowances: London Weighting (£3,150), London Allowance (£6,588 max), South East Allowances

### 4. Police Remuneration Review Body (PRRB) — 10th Report 2024
**URL:** https://assets.publishing.service.gov.uk/media/66a7a84cab418ab055592ef0/PRRB_2024_report_-_web_version.pdf

Key recommendations effective 1 September 2024:
- Consolidated 4.75% increase for all ranks up to chief superintendent
- London Weighting uprated to £3,024
- Constable starting pay: £29,907; top: £48,231
- Confirmed removal of Sergeant pay points 0 and 1

### 5. Police Remuneration Review Body (PRRB) — 11th Report 2025
**URL:** https://assets.publishing.service.gov.uk/media/688cca3625ba7325501b096e/PRRB_11th_Report_2025_Accessible_v02.pdf

Recommendations effective 1 September 2025:
- Restructuring of sergeant to chief superintendent pay scales
- Confirmed 4.75% uplift carried forward

### 6. Winsor Review — Part 2 (2011–2013)
**GOV.UK summary:** https://www.gov.uk/guidance/police-pay-winsor-review
**BBC News (Jan 2013):** https://www.bbc.com/news/uk-21027176
**Winsor Table of Progress PDF:** https://assets.publishing.service.gov.uk/media/5a804697ed915d74e622d821/2015_03_26_-_Winsor_-_Table_of_progress.pdf

Key reforms:
- Cut PC starting salary from ~£23,000 to £19,000 from April 2013
- New superintendent pay scale with starting salary of £60,094 from April 2014
- Maximum superintendent salary: £72,585
- Post-related allowance for chief inspectors discontinued

### 7. Three-Year Pay Settlement (2005–2007)
**URL:** https://www.gov.uk/government/publications/a-three-multi-year-pay-settlement-for-police-officers

Multi-year deal implemented:
- 2.6% from 1 September 2005
- 2.55% from 1 September 2006
- 2.55% from 1 September 2007
- PNB Circular 08/05 contains full scales

### 8. Metropolitan Police / Metfriendly — London Pay Scales
**Metfriendly 2019/2020 PDF:** https://cdn2.hubspot.net/hubfs/3349735/Metfriendly%20Police%20Pay%20Scales%202019%202020.pdf

Provides Metropolitan Police-specific scales including:
- London Weighting and London Allowance 1/2 breakdowns
- PC starting salary with London package

### 9. ONS Consumer Price Index (CPI)
**Base year:** 2015 = 100

Used to calculate real-terms values:
- 1999: 71.5
- 2000: 72.6
- 2005: 78.5
- 2010: 89.0
- 2013: 98.5
- 2015: 100.0
- 2020: 108.8
- 2024: 134.0
- 2025: 137.5

---

## Interpolated Data (Gaps Filled by Estimation)

### Years with Linear Interpolation
For **Sergeant, Inspector, and Superintendent**, the following years are interpolated between known anchor points:

| Rank | Known Anchors | Interpolated Years |
|------|--------------|-------------------|
| **Sergeant** | 2000, 2024, 2025 | 2001–2023 |
| **Inspector** | 2000, 2024, 2025 | 2001–2023 |
| **Superintendent** | 2000, 2014, 2024, 2025 | 2001–2013, 2015–2023 |

### Method
Linear interpolation assumes constant annual change between anchor years. This smooths out actual year-to-year variations (e.g., pay freezes in 2010–2012, sporadic awards in 2018–2021) but preserves the overall trajectory.

### Known Limitations
1. **2010–2012 pay freeze:** Most ranks saw no increase, but interpolation smooths this into gradual change.
2. **2013 Winsor disruption:** The abrupt cut to PC starting salaries is captured, but senior rank impacts may be understated.
3. **London Allowances:** Metropolitan PC figures include historical London Weighting + Allowances, but exact year-to-year allowance changes are not all individually verified.
4. **Top-of-scale figures:** Less frequently published than starting salaries; some inferred from pay scale structures.

---

## Additional Reference Sources

### Police Superintendents' Association — Pay Documents
**URL:** https://www.policesupers.com/documents/pay
Historical pay scales for superintendents and chief superintendents.

### West Midlands Police — FOI Pay Scales
**URL:** https://www.westmidlands.police.uk/SysSiteAssets/foi-media/west-midlands/what_we_spend_and_how_we_spend_it/police-officer-payscales---wef-1st-september-2025.pdf
Force-level payscale document showing historical progression.

### Home Office Evidence to PRRB 2026/27
**URL:** https://www.gov.uk/government/publications/home-office-evidence-to-the-police-remuneration-review-body-2026-to-2027/home-office-evidence-to-the-police-remuneration-review-body-2026-to-2027-accessible
Affordability assessment: up to 2.5% pay award suggested for 2026-27.

### SMF — "Examining British police pay and the 'P-Factor'"
**URL:** https://www.smf.co.uk/commentary_podcasts/police-pay-and-p-factor/
Analysis showing 40% nominal pay rise 2000–2023 but significant real-terms decline since 2010.

---

## Confidence Levels by Data Point

| Data | Confidence | Notes |
|------|-----------|-------|
| PC National 1999–2025 | **High** | Multiple verified sources year-by-year |
| PC Metropolitan 1999–2025 | **High** | From Met Police careers + Metfriendly |
| Sergeant 2000, 2024, 2025 | **High** | Direct from Hansard / Police Federation |
| Sergeant 2001–2023 | **Medium** | Linear interpolation; trajectory correct but year-to-year may vary |
| Inspector 2000, 2024, 2025 | **High** | Direct from Hansard / Points2Prove |
| Inspector 2001–2023 | **Medium** | Linear interpolation |
| Superintendent 2000, 2014, 2024, 2025 | **High** | Hansard / Winsor / Points2Prove |
| Superintendent 2001–2013, 2015–2023 | **Medium** | Linear interpolation; 2014 Winsor restructuring captured |
| CPI data | **High** | Official ONS statistics |
| Real-terms calculations | **High** | Standard deflation methodology |
