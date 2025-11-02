# Teaching Guide: Statistics 101 for Evaluation
**90-Minute Session for Evidence and Impact Module 2025-26**

## Overview & Preparation

### Session Structure
- **Total Duration:** 90 minutes
- **Format:** Lecture + Interactive Demos + Discussion
- **Audience:** Civic tech practitioners, evaluators, program managers
- **Level:** Intermediate (some prior exposure to basic stats helpful but not required)

### Key Teaching Principles
1. **Start with WHY**: Every concept begins with a real-world civic tech scenario
2. **Build intuition first, formulas second**: Understanding > memorization
3. **Interactive engagement**: Use demos to make abstract concepts concrete
4. **Connect to practice**: Every statistical concept ties to actual evaluation decisions

### Materials Needed
- Slides with working interactive demos (3 Plotly-based tools)
- Whiteboard/digital board for sketching distributions and concepts
- Backup examples in case demos don't work
- Handout with formulas and resources (optional)

---

## Pre-Session Checklist (15 minutes before)

- [ ] Test all interactive demos (3 Plotly tools)
- [ ] Open slide deck and verify animations work
- [ ] Prepare whiteboard/markers
- [ ] Have water ready (lots of talking!)
- [ ] Mental warm-up: review the 5 key takeaways
- [ ] Set timer/clock visible for pacing

---

## Part 1: Distributions & Law of Large Numbers (18 minutes)

### Opening (2 min)

**What to say:**
> "Welcome everyone! Today we're building statistical intuition for evaluation. This isn't about memorizing formulas - it's about developing mental models that help you design better studies, interpret results correctly, and communicate findings confidently. Every concept we cover connects directly to decisions you'll make in civic tech evaluation."

**Energy:** Start warm and enthusiastic. Make eye contact. Acknowledge that stats can feel intimidating but emphasize we're demystifying it together.

### Learning Goals (1 min)

**Read through the four goals**, then add:
> "By the end of today, you'll be able to look at an evaluation report and spot the good practices, the red flags, and the missing pieces. You'll also be equipped to design your own studies with appropriate sample sizes and analysis plans."

### The Problem: Noise vs Signal (3 min)

**Teaching Strategy:** Make this concrete and relatable.

**What to say:**
> "Imagine you're working with a council that just redesigned their online service form. You're tracking daily completion rates. Before the redesign, rates bounced between 38% and 56%. After, they bounce between 42% and 58%. 
>
> The program manager comes to you excited: 'It's working! Look, the rates went up!'
>
> But did they? Or is this just... noise?"

**Pause here. Ask the room:**
> "How would you respond to this manager? What would you need to know to be confident?"

**Listen for answers like:**
- "Need more time/data"
- "Need to compare to a control group"
- "Need to know how variable the rates normally are"

**Affirm these**, then transition:
> "Exactly! This is THE foundational challenge in evaluation. Everything we do today builds on answering this question: How do we distinguish real change from random variation?"

### What Is a Distribution? (4 min)

**Visual approach:** If possible, sketch a histogram on the board while explaining.

**What to say:**
> "A distribution describes how outcomes vary across repeated observations. Think of it as a fingerprint of your data's behavior.
>
> For our form completion example, if we tracked daily rates for 30 days, we could plot them. Some days 40%, some days 52%, most clustering around 45%. That pattern - that shape - is the distribution.
>
> It tells us three crucial things:
> 1. **Mean (μ)**: The center - where outcomes tend to cluster. Maybe 45%.
> 2. **Variance (σ²)**: How spread out the data is
> 3. **Standard deviation (σ)**: Typical distance from the mean - maybe 8 percentage points
>
> Here's the key insight: *Even with no change to the form*, you'll see variation day-to-day! Some days you just get more motivated users. Some days the website is slower. Random stuff happens.
>
> If you don't understand what 'normal variation' looks like, you can't tell when something actually changed."

**Check for understanding:** "Make sense so far? Any questions about distributions?"

### Law of Large Numbers (3 min)

**What to say:**
> "Now comes a beautiful mathematical fact that underlies all of evaluation: the Law of Large Numbers.
>
> It says: As your sample size grows, your sample mean gets closer and closer to the true population mean. With more data, your estimate stabilizes.
>
> **[Show formula on slide]**
>
> In plain English: If you measure completion rates for 1 day, it's noisy. For 30 days? More stable. For 180 days? Very stable.
>
> This is why 'wait and collect more data' is usually good advice! It's not just intuition - it's mathematical law.
>
> Classic example: Flip a fair coin 10 times, you might get 7 heads (70%). Flip 1,000 times? You'll be very close to 50%. Flip 10,000 times? Practically exactly 50%."

**Relate back to scenario:**
> "For our form evaluation: Measuring over 1 day is noisy. Over 30 days? Much more reliable. The LLN tells us this formally."

### Central Limit Theorem (2 min)

**Keep this light** - it's a preview, not deep dive.

**What to say:**
> "Quick preview of another magical fact: Even if individual outcomes are weirdly distributed, *averages* tend to look Normal - bell-curved.
>
> This is the Central Limit Theorem. It's why we can use Normal-based tools like confidence intervals even when our raw data isn't perfectly Normal.
>
> The key: sample size matters. Larger n → the average is more reliably Normal-shaped."

**Show the visual** if available (sampling distributions getting narrower/more Normal).

### Binary Outcomes (2 min)

**What to say:**
> "Most civic tech outcomes are binary: Yes/No, Click/No click, Complete/Abandon, Attend/Miss.
>
> For binary outcomes, we use the Bernoulli distribution. Each person has probability *p* of success.
>
> **[Show formulas on slide]**
>
> Key insight: Variance = p(1-p)/n. Notice three things:
> 1. Variance is highest when p=0.5 (maximum uncertainty)
> 2. Variance decreases as p approaches 0 or 1
> 3. Most importantly: Variance decreases with 1/n
>
> That last point means: To cut your uncertainty in half, you need 4× the sample size. That square root relationship is crucial for planning studies."

### Interactive Demo: Sampling Distribution (3 min)

**How to use the demo:**

1. **Set initial parameters:** True p = 0.45, Sample n = 50, # Samples = 1000
2. **Click "Draw Samples"** and narrate what appears:
   > "Look at this distribution. These are 1,000 simulated samples, each with 50 people. The red line shows the true value (45%). See how the samples are spread around it? That's sampling variability.
   >
   > Notice the statistics box: The mean of all samples is very close to 0.45 - that's the Law of Large Numbers in action."

3. **Now increase n to 200** (4× larger):
   > "Watch what happens when we quadruple the sample size..."
   > **[Click Draw Samples]**
   > "The distribution got narrower! By a factor of 2 (square root of 4). Same true value, but much less spread. More data = more precision."

4. **Invite participation:**
   > "What do you think happens if we set n = 500? Will it be narrower or wider?"

**Teaching point:**
> "This visualization shows you *where uncertainty comes from*. It's not about this one sample you collected - it's about the fact that if you'd collected a different sample, you'd get a slightly different answer. Understanding this distribution of possible samples is the foundation of statistical inference."

### Key Takeaway (1 min)

**Read the takeaway, then emphasize:**
> "Remember: Variation is normal and expected. Without understanding the distribution and how it relates to sample size, you literally cannot tell signal from noise. This is why anecdotes and tiny pilots, while valuable for learning, are dangerous for decision-making."

**Transition:**
> "Now we know how to think about distributions and sample size. Next question: Once we've collected data and see a difference, how do we formally test if it's real?"

---

## Part 2: p-Values, Significance & Confidence Intervals (17 minutes)

### The Problem: Did It Actually Work? (2 min)

**What to say:**
> "New scenario: You're testing two outreach emails inviting residents to a community safety survey.
> - Email A (standard): 12.3% response rate
> - Email B (personalized): 15.8% response rate
>
> Email B looks better - 3.5 percentage points higher! The comms team wants to declare victory.
>
> But should they?"

**Pause. Ask the room:**
> "What would make you more or less confident this difference is real?"

**Listen for:**
- Sample size
- How variable responses typically are
- Whether groups were comparable

**Then:**
> "Yes! All of these matter. We need a formal framework to answer: Is this difference larger than what we'd expect from random chance alone?"

### The Null Hypothesis (3 min)

**What to say:**
> "Enter the null hypothesis - H₀. This is your skeptical starting point. It says: 'I don't believe Email B is better. Prove it to me.'
>
> Mathematically: H₀ says pₐ = p_B. No real difference.
>
> The alternative hypothesis H₁ says: There IS a difference.
>
> Our test asks: *If the null were true* - if emails A and B really were identical - how surprising is what we observed?
>
> **Important philosophical point:** We never 'prove' the alternative. We only reject or fail to reject the null. It's like a court trial: We assume innocence (null) until evidence is strong enough to reject that assumption."

**This might feel backward!** Address it:
> "I know it feels weird to start by assuming no effect. Why not just test if B is better? The reason is mathematical: We can calculate what random chance looks like under the null. Then we check if our data is inconsistent with that. It's about building evidence against the null, not proving the alternative."

### Test Statistic & Standard Error (3 min)

**What to say:**
> "What we observed: p_B - pₐ = 15.8% - 12.3% = 3.5 percentage points.
>
> But is 3.5pp a lot? It depends!
> - With 10,000 people per group → definitely significant
> - With 50 people per group → probably just noise
>
> We need to standardize this difference relative to its uncertainty. That's what the Standard Error does.
>
> **[Show SE formula on slide]**
>
> Standard Error measures: If we repeated this experiment, how much would our estimate bounce around? It combines:
> - The variability in Group A
> - The variability in Group B  
> - The sample sizes
>
> The formula looks intimidating, but conceptually it's simple: SE tells you how noisy your estimate is."

**Don't dwell on the formula.** The key is intuition.

**Continue:**
> "Once we have SE, we calculate how many standard errors away from zero our difference is. If it's way out in the tail - very far from zero - that's surprising under the null. That's what the p-value quantifies."

### p-Values (4 min)

**This is crucial and commonly misunderstood. Go slowly.**

**What to say:**
> "The p-value answers: If emails A and B were truly identical, how often would we see a difference as large as 3.5pp (or larger) just by random chance?
>
> - p < 0.05 is the traditional 'statistically significant' threshold
> - p = 0.03 means: Only 3% of the time would random chance produce a difference this big or bigger
>
> **CRITICAL:** Here's what p-values are NOT:
> ❌ NOT the probability the null is true
> ❌ NOT the probability Email B doesn't work
> ❌ NOT the probability you made a mistake
>
> They ARE:
> ✅ Probability of seeing data this extreme if the null were true
>
> It's a statement about the data, not about the hypothesis."

**Pause. Check understanding:**
> "Does that distinction make sense? p-values are about: *Given a null world, how surprising is this data?* Not: *Given this data, how likely is the null?* That's backwards."

**Common mistake to address:**
> "People treat p=0.049 as 'significant' and p=0.051 as 'not significant' like there's a cliff. But there's no meaningful difference between these! The 0.05 threshold is arbitrary. It's better to report the actual p-value and let people interpret the strength of evidence."

### Type I and Type II Errors (2 min)

**Show the table on the slide.**

**What to say:**
> "Every hypothesis test can go wrong in two ways:
>
> **Type I Error (α):** False positive. You reject the null when it's actually true. You say it works when it doesn't. This is what p<0.05 controls - you accept a 5% false positive rate.
>
> **Type II Error (β):** False negative. You fail to reject the null when it's actually false. You say it doesn't work when it does. Power = 1-β. We'll talk more about power in Part 3.
>
> In civic tech, which is worse?
> - Type I: You scale a program that doesn't work → waste resources
> - Type II: You abandon a program that works → miss impact
>
> There's always a tradeoff. You can't minimize both simultaneously with fixed sample size. When you set α=0.05, you're saying 'I'm willing to accept 5% false positives to avoid too many false negatives.'"

### Confidence Intervals (3 min)

**This is where you pivot from p-values to something better.**

**What to say:**
> "Here's a better tool than p-values: Confidence Intervals.
>
> A 95% CI gives you a range of plausible effect sizes. For our email example:
> - Observed difference: 3.5pp
> - 95% CI: [0.2pp, 6.8pp]
>
> **Interpretation:** We're 95% confident the true effect is somewhere between 0.2pp and 6.8pp.
>
> Why is this better than just p<0.05?
> 1. Shows MAGNITUDE: Not just 'is there an effect?' but 'how big might it be?'
> 2. Shows PRECISION: Wide CI = uncertain. Narrow CI = precise.
> 3. Shows PRACTICAL SIGNIFICANCE: Is the lower bound large enough to care about?
>
> For decision-making, CIs are much more useful. They tell you: 'The effect is probably somewhere in this range. Is that range good enough to justify scaling the program?'"

**Note the connection:**
> "Notice the CI barely excludes zero (lower bound is 0.2pp). That's consistent with p≈0.05. But the CI tells us much more - it says the effect might be as small as 0.2pp or as large as 6.8pp. That uncertainty matters for decisions!"

---

## Part 2 Continued: P-Hacking & Demos (7 minutes)

### P-Hacking Section (3 min)

**This is important - emphasize strongly.**

**What to say:**
> "Now I need to warn you about one of the biggest problems in evaluation and science generally: p-hacking.
>
> **What is it?** Testing multiple hypotheses but only reporting the 'significant' ones.
>
> Here's the math: With α=0.05, pure random chance gives you 1 false positive per 20 tests. So if you test 20 things, you EXPECT one to be 'significant' even if nothing actually works.
>
> **Common forms in civic tech:**
> - Test 5 different outcomes, only report the 2 that are 'significant'
> - Analyze by age, gender, location, device, time-of-day, income... report only significant subgroups
> - Peek at data as it comes in, stop collecting when p<0.05
> - Try different statistical methods until one 'works'
>
> **The result:** Findings that won't replicate. Programs that don't actually work get scaled. Resources wasted. Trust eroded."

**Real example:**
> "Imagine you test your civic tech app on:
> - 5 outcomes (completion, engagement, satisfaction, referrals, time-on-task)
> - 4 demographic groups (young/old × male/female)
> - 3 devices (mobile/tablet/desktop)
>
> That's 60 possible comparisons! If you report only the 3 that were 'significant,' you're almost certainly reporting false positives."

### P-Hacking Simulator Demo (4 min)

**This demo is powerful - let it sink in.**

**How to use it:**

1. **Set parameters:**
   - Outcomes: 5
   - Subgroups: 4
   - n per test: 100
   - α: 0.05

2. **Before clicking "Run Tests," ask:**
   > "We're about to run 20 tests (5 outcomes × 4 subgroups). Every single one is NULL - there's no real effect anywhere. Both groups come from the same distribution. How many 'significant' results do you think we'll see?"

3. **Listen for answers.** Then:
   > "On average, we expect 20 × 0.05 = 1 false positive."

4. **Click "Run Tests"** and narrate:
   > "Look at this plot. Each dot is one test. Blue dots below the red line are 'significant' (p<0.05). 
   >
   > We got [X] significant results. But remember: ALL tests are null! These are purely chance findings.
   >
   > If you only reported these blue dots, you'd be p-hacking. You'd claim 'The program increased engagement for young males using mobile' or whatever. But it was just noise."

5. **Run it again** to show variation:
   > "Let's run it again... different tests are 'significant' this time. That's randomness at work."

6. **Point to the Bonferroni correction note:**
   > "If you MUST test 20 hypotheses, divide your α by 20. Use α=0.0025 instead of 0.05. This controls the family-wise error rate. But honestly, the better solution is..."

### Prevention: Pre-registration (in the slides after demo)

**What to say:**
> "The solution is **pre-registration**. Before you collect data:
> 1. Specify ONE primary outcome
> 2. Define your analysis plan
> 3. Register it publicly (OSF.io, AsPredicted.org, clinical trials registry)
>
> This removes your degrees of freedom. You can't p-hack if everyone can see what you planned to test.
>
> If you do exploratory analyses - which is fine! - label them as exploratory: 'Our pre-registered primary outcome showed no effect. However, exploratory analysis suggests an effect for subgroup X. This needs confirmation in a new study.'
>
> Pre-registration is standard in clinical trials and increasingly expected in social science. Civic tech should adopt these standards too."

### Case Study Prompts (discussion, if time)

**Question 1:**
> "If you observe +3.8pp with 95% CI [−0.4pp, +8.0pp], how do you brief a stakeholder?"

**Good answer:**
> "Email B increased response by 3.8pp, but the confidence interval includes negative values (just barely). We can't rule out no effect. To be confident, we'd need more data. The effect might be real and positive, or it might be zero - we're uncertain."

**Bad answers:**
> "It didn't work" → Too strong, CI suggests likely positive effect
> "It definitely worked, 3.8pp increase" → Ignores uncertainty

**Question 2:**
> "Your trial reports p=0.047, but 8 secondary outcomes were also tested. What does 'significant' mean now?"

**Answer:**
> "With 8 tests at α=0.05, we'd expect ~0.4 false positives even if nothing worked. This one 'significant' result might be noise. Either use Bonferroni correction (α=0.05/8=0.00625) or acknowledge this is exploratory and needs replication."

### Key Takeaway: Part 2 (1 min)

**Read the slide, then emphasize:**
> "Move away from binary 'significant/not significant' thinking. Report effect sizes with confidence intervals. Pre-register your analyses. Be transparent about what you tested. This builds credible evaluation."

**Transition:**
> "We can now test whether an effect is real. But there's a crucial design question: How many participants do we need to reliably detect effects? That's about power..."

---

## Part 3: Power & Sample Size (16 minutes)

### The Problem: Planning Ahead (2 min)

**What to say:**
> "New scenario: You're planning an SMS reminder intervention to reduce missed clinic appointments.
> - Current rate: 42% of people miss appointments
> - Your goal: Reduce to 39% (3 percentage point improvement)
>
> The operations lead asks: 'How many people do we need in our trial?'
>
> This is the planning phase of evaluation. Too often, people run pilots with 50 people per group, find inconclusive results, and wonder why."

**Ask the room:**
> "What factors determine how many participants you need?"

**Listen for:** Effect size, uncertainty tolerance, budget, time

**Then:**
> "All correct! Formally, it depends on:
> 1. How big an effect you want to detect (Minimum Detectable Effect)
> 2. How much uncertainty you'll tolerate (α)
> 3. How reliably you want to detect real effects (power)
>
> These are design choices you make BEFORE collecting data."

### What Is Power? (3 min)

**What to say:**
> "Statistical power is the probability you'll detect a real effect if it exists.
>
> Formally: Power = 1 - β = Probability of rejecting H₀ when H₁ is true
>
> **Think of it as the sensitivity of your study.** 
> - Low power (50%): You'll only detect the effect half the time. Flip a coin!
> - High power (80%): You'll detect it 80% of the time. Much more reliable.
> - Very high power (95%): Almost always detect it. But requires huge samples.
>
> The standard target is 80% power. Why not higher?
> - Because sample size grows fast. 80% to 90% power might require 50% more people.
> - It's a balance between certainty and feasibility.
>
> **Analogy:** Power is like the strength of your microscope. Low power (small n) → you can only see BIG effects. High power (large n) → you can detect subtle effects."

**Key point:**
> "In civic tech, low power is expensive! You run a pilot, find 'no effect,' abandon the program... but actually the effect was there. You just couldn't see it because your study was too small. That's a waste."

### The Power-Sample Size Relationship (3 min)

**What to say:**
> "Here's the key relationship: Detecting small effects requires large samples.
>
> **[Show formula on slide but don't dwell on it]**
>
> You don't need to memorize this formula! Use online calculators or R packages. But notice two crucial patterns:
>
> 1. **n grows with 1/(effect size)²**
>    - Want to detect half the effect? Need 4× the sample size!
>    - This is why small-effect studies need thousands of participants
>
> 2. **n grows with baseline variance**
>    - Outcomes near 50% have highest variance → need more data
>    - Outcomes near 0% or 100% have lower variance → need less data
>
> **Example calculation:** To detect a 3pp effect with baseline 42%, 80% power, α=0.05:
> - You need approximately 1,370 people per arm
> - That's 2,740 total!
>
> That surprises people. 'That many??' Yes. Small effects need large samples."

**Emphasize:**
> "Many civic tech pilots are dramatically underpowered. They test 100 people, find p=0.15, and conclude 'it doesn't work.' But actually they only had power to detect effects larger than 10pp. If the real effect was 5pp - still meaningful! - they'd miss it 70% of the time."

### Effect Size: MDE Thinking (3 min)

**This is where stats meets policy.**

**What to say:**
> "Here's a crucial concept: **Minimum Detectable Effect (MDE)**. This is the smallest effect your study can reliably detect.
>
> But here's the question that should drive your design: **What effect size would actually matter for decisions?**
>
> For our appointment intervention:
> - 1pp improvement: Probably not worth scaling. Too small to care about.
> - 5pp improvement: Worth considering. Meaningful impact.
> - 10pp improvement: Definitely worth scaling. Clear winner.
>
> **Design principle:** Match your MDE to your practical significance threshold.
>
> If you need ≥5pp to justify scaling, but your study can only detect ≥10pp (underpowered), you might miss important effects.
>
> Conversely, if you power for 1pp but would never scale for <5pp, you're oversampling. Wasteful."

**This is a strategy conversation:**
> "Before designing your study, ask stakeholders: 'What's the minimum improvement that would change our decision?' Then design to detect that effect size. Don't just say 'let's get 500 people because that's what we can afford' without checking what MDE that gives you."

### Power Curves (showing the graphs, 2 min)

**If you have pre-made graphs, show them. Otherwise, sketch on board.**

**What to say:**
> "Two useful visualizations:
>
> **1. Power curve vs n** (for fixed effect size):
> - X-axis: sample size per arm
> - Y-axis: statistical power
> - Shows: How power increases as you add people
> - Typical shape: S-curve. Steep in the middle, flat at extremes
> - Interpretation: Going from n=200 to n=400 per arm might take you from 50% to 80% power. Big jump! But going from n=1000 to n=1200 only gives you 85% to 87%. Diminishing returns.
>
> **2. MDE curve vs n** (for fixed power):
> - X-axis: sample size per arm
> - Y-axis: minimum detectable effect
> - Shows: What effect sizes you can detect for given n
> - Typical shape: Hyperbola (1/√n relationship)
> - Interpretation: With n=200, maybe you detect 8pp effects. With n=800, maybe 4pp effects. With n=3200, maybe 2pp effects.
>
> **Key insight:** There's no magic n. It depends on what matters to you."

### Interactive Demo: Power Calculator (3 min)

**This is a practical planning tool. Make it hands-on.**

**How to use it:**

1. **Set realistic parameters:**
   - Baseline: 0.42 (42% miss appointments)
   - MDE: 0.03 (want to detect 3pp effect)
   - α: 0.05
   - Power: 0.80

2. **Show the result:**
   > "The calculator says we need 1,370 people per arm - 2,740 total. Look at the power curve: it crosses the 80% threshold (red line) right at our required n."

3. **Now experiment - invite participation:**
   > "What if we're more ambitious? Let's try detecting a 1pp effect instead of 3pp..."
   
   **[Change MDE to 0.01]**
   
   > "Whoa! Now we need over 12,000 per arm. That's the quadratic relationship - one-third the effect size requires 9× the sample. Often infeasible."

4. **Try the opposite:**
   > "What if we accept a larger MDE - say 10pp?"
   
   **[Change MDE to 0.10]**
   
   > "Only need 130 per arm. Much more feasible. But can we only scale if we see 10pp effects? Probably not - we'd miss important 5pp effects."

5. **Key teaching moment:**
   > "This is the fundamental tradeoff: precision vs feasibility. You need to find the sweet spot where your MDE aligns with practical significance and your budget/timeline."

**Note about the side panel:**
> "See the relationship: √n appears in the statistics. That's why halving the effect requires 4× the sample - it's all about that square root relationship from Part 1."

### Case Study Prompts (2 min)

**Question 1:**
> "With baseline 42%, desired MDE of -3pp, 80% power, what n is needed?"

**Answer:**
> "Approximately 1,370 per arm (2,740 total). Often surprising - 'We're spending all that to detect just 3 percentage points??' But yes, precision is expensive."

**Question 2:**
> "What if you can only get 1,200 people total (600 per arm)? What MDE is realistic at 80% power?"

**Use the calculator to show:**
> "With n=600, your MDE is probably around 5pp. So you can ask: Is that meaningful? If 5pp would justify scaling, you're good. If you need to detect 3pp effects, you're underpowered."

**Emphasize honesty:**
> "Don't run an underpowered study and conclude 'no effect' when you simply couldn't detect it. Better to acknowledge upfront: 'Our study can detect effects ≥5pp but not smaller effects.'"

### Practical Constraints (1 min)

**Quick coverage of the slide:**

> "Reality check: Often you CAN'T get more people. Budget, time, eligible population are fixed.
>
> Options:
> 1. Accept lower power → report this limitation
> 2. Accept larger MDE → can only detect big effects
> 3. **Reduce variance** → often overlooked! Better measurement, stratification, matched designs
> 4. Use more powerful study design → within-subjects, stepped wedge
>
> Option 3 is underused. If you can reduce outcome variance by 30%, that's equivalent to increasing your sample size by about 40%. Control for baseline covariates, use paired designs, stratify by risk level - all help."

### Key Takeaway: Part 3 (1 min)

**Read the slide, then emphasize:**
> "Power analysis is not optional. It's the difference between a credible evaluation and a wasted pilot. Always do power calculations during design, not after data collection. Report: 'This study can detect effects ≥Xpp with 80% power.'"

**Transition:**
> "We can now design powered studies and test for effects. But what if we need to control for confounding variables - age, location, prior behavior? That's where regression comes in..."

---

## Part 4: Regression & Linear Modelling (24 minutes)

### The Problem: Confounding (2 min)

**What to say:**
> "New scenario: You roll out a campaign - posters plus emails - to promote community consultation.
>
> But here's the complication:
> - Younger residents (18-35) were more exposed to the campaign
> - Younger residents also use mobile devices more
> - Both age AND mobile usage might independently affect participation
>
> So when you see higher participation among those exposed to the campaign... is that because:
> - The campaign worked?
> - They're younger and younger people participate more anyway?
> - They use mobile which makes participation easier?
> - All of the above?
>
> This is confounding. Simple before/after or treatment/control comparisons break down. You need to adjust for these other factors."

**Ask:**
> "Why might younger people participate more even without the campaign?"

**Listen for:** More tech-savvy, more time, different priorities, etc.

### What Is Regression? (3 min)

**What to say:**
> "Regression models the relationship between:
> - An outcome variable (Y): participation rate, completion, attendance
> - One or more predictor variables (X): treatment, age, device, etc.
>
> Ordinary Least Squares (OLS) - fancy name for 'line of best fit' - finds the equation:
>
> **[Show equation on slide]**
>
> y = β₀ + β₁×Treatment + β₂×Age + β₃×Mobile + error
>
> The outcome is a combination of these effects plus random noise.
>
> **Key insight:** Each β coefficient is the effect of THAT variable, *holding all others constant*.
> - β₁ = effect of treatment, assuming age and device stay the same
> - β₂ = effect of age, assuming treatment and device stay the same
>
> This is how we 'control for' confounders."

**Connect to familiar concepts:**
> "Regression extends t-tests and ANOVA. It's the workhorse of applied evaluation. But remember: regression ≠ causation! It only gives causal estimates if you have good design (RCT or credible adjustment strategy)."

### Interpreting Coefficients (4 min)

**Show the example table on the slide.**

**Walk through each row carefully:**

> "**Intercept (0.28):** Baseline participation rate for someone age 0, not treated, not on mobile. Often not literally interpretable (no one is age 0!), but needed for the equation.
>
> **Treatment (0.029):** This is what we care about! The campaign increased participation by 2.9 percentage points, after accounting for age and device.
> - Std Error: 0.014 → our uncertainty about this coefficient
> - p-value: 0.038 → statistically significant at α=0.05, but remember from Part 2, we care more about the effect size and CI!
>
> Notice: This adjusted effect (2.9pp) might be smaller than the raw unadjusted difference. That suggests some of the apparent campaign effect was actually due to age/device differences.
>
> **Age (-0.002):** Each additional year of age is associated with 0.2 percentage point lower participation.
> - So a 10-year age difference → 2pp lower participation
> - Negative sign means older people participate less
>
> **Mobile (0.045):** Using mobile (vs desktop) increases participation by 4.5pp.
> - This is actually a bigger effect than the campaign!
> - Suggests platform really matters"

**Teaching moment:**
> "When you have multiple predictors, you're asking: *For people of the same age, using the same device, does the campaign matter?* That's what β₁ tells you. It's the 'all else equal' effect."

### Regression as Adjusted Means (2 min)

**This builds intuition.**

**What to say:**
> "Here's an intuitive way to think about regression: It's comparing groups AFTER adjusting for other factors. Like matching.
>
> Imagine two histograms (treatment vs control), but you've matched them on age and device first. So you're comparing apples to apples.
>
> β₁ is the difference in average outcomes after this matching.
>
> Without adjustment:
> - Treatment group is younger, more mobile → participates more
> - Some of this is treatment effect, some is just demographics
>
> With adjustment:
> - We estimate: 'For people of the SAME age, using the SAME device, how much does treatment matter?'
> - That's the adjusted effect
>
> This is why randomization is so powerful: In RCTs, treatment and control are already balanced (on average), so you don't need adjustment. But in observational studies, adjustment is crucial."

**Caveat:**
> "Important limitation: Regression only adjusts for variables you INCLUDE. If there's an unmeasured confounder - like prior interest in the topic - your estimate can still be biased. This is why good design (RCTs, natural experiments) is so valuable."

### Assumptions (2 min)

**Don't get too technical, but mention them:**

> "For OLS to give reliable results, four assumptions:
>
> 1. **Linearity** (in parameters): The βs combine additively. You can transform X (e.g., Age²) but not β.
>
> 2. **Exogeneity:** The error term is uncorrelated with X. No unmeasured confounders.
>    - This is the big one! If treatment is assigned based on unobserved factors (e.g., more motivated people opt in), β₁ will be biased.
>    - This is why randomization matters
>
> 3. **No perfect multicollinearity:** Predictors aren't exact copies. If Age and Years of Education are nearly identical, regression can't tell them apart.
>
> 4. **Homoskedasticity:** Error variance doesn't depend on X. Often violated in practice.
>
> **Practical tip:** Use robust standard errors to relax assumption #4. This is standard practice and doesn't change your point estimates, just makes your SEs more reliable."

**Don't stress if people look confused:**
> "Bottom line: If you're worried about these assumptions, use robust standard errors and check diagnostic plots. We'll see those next."

### Clustering & Robust SEs (3 min)

**This is important and often overlooked.**

**What to say:**
> "Here's a common mistake: Ignoring clustering in your data.
>
> **Problem:** Outcomes within the same group (ward, school, household) are correlated. People in the same ward are more similar than people in different wards.
>
> **Why it matters:** If you ignore clustering, your standard errors will be too small. You'll think you're more certain than you actually are. False positives.
>
> **Example:** 20 schools each recruit 50 families (1,000 people total).
> - You don't have 1,000 independent observations
> - You have 20 semi-independent clusters
> - Effective sample size is somewhere between 20 and 1,000
>
> **Solution:** Use cluster-robust standard errors, clustered by school.
> - This inflates your SEs (appropriately!)
> - Makes your inferences more conservative
> - More honest about uncertainty
>
> **In R:** Use `sandwich::vcovCL(cluster = ~school_id)` after fitting your model.
>
> **Rule:** If your design has any grouping structure, ALWAYS use clustered SEs."

**Examples of when to cluster:**
> "- Participants from same council area
> - Households (people in same house)
> - Repeated measures (same person multiple times)
> - Classrooms, neighborhoods, organizations"

### Diagnostics (3 min)

**Show the three key plots on the slide (or sketch on board).**

**What to say:**
> "Never trust regression blindly. Always check diagnostics. Three key plots:
>
> **1. Residuals vs Fitted:**
> - Should look like random scatter (no pattern)
> - If you see a pattern (e.g., curved, funnel-shaped), your model is wrong
> - Funnel shape → heteroskedasticity (use robust SEs)
> - Curved pattern → might need Age² or log transform
>
> **2. Q-Q Plot:**
> - Should be roughly a straight line
> - Tests if errors are Normal
> - Deviations → non-Normal errors (often okay with large n due to CLT)
> - Heavy tails → some extreme values (consider robust regression)
>
> **3. Leverage Plot:**
> - Identifies influential observations
> - High leverage + large residual = outlier that pulls the line
> - Check: Data error? Valid but unusual?
> - Run sensitivity analysis: Remove it, see if conclusions change
>
> **Never skip diagnostics!** They often reveal data quality issues or model misspecification."

**If you have example plots, walk through:**
> "Good residual plot: Random cloud. Bad residual plot: Clear pattern or outliers."

### R² and Model Fit (2 min)

**Debunk the R² obsession:**

**What to say:**
> "R² measures proportion of variance explained. R²=0.15 means the model explains 15% of variation in Y.
>
> **Important: R² ≠ whether your model is good!**
>
> You can have:
> - R²=0.05 but precise, credible treatment effect
> - R²=0.90 but biased due to confounding
>
> In social science, R² is often low (0.10-0.30) because human behavior has many causes. That's okay!
>
> **What matters:**
> 1. Is your treatment effect β₁ precisely estimated? (small SE)
> 2. Have you controlled for main confounders?
> 3. Do your diagnostics look good?
>
> Don't chase high R² by adding irrelevant predictors. Focus on answering your causal question."

### Teaching Regression Concepts (3-4 min)

**Note:** This section describes concepts that would ideally be shown with an interactive tool. Since the Regression Sandbox tool is not yet implemented, use pre-made examples or board illustrations.

**Concepts to demonstrate:**

1. **Unadjusted vs adjusted estimates:**
   > "Show example: Treatment effect is 5.2pp without adjustment. After controlling for age and device, drops to 2.9pp. Why? Because treatment group was younger and more mobile. Some of the 5.2pp was confounding bias."

2. **Impact of robust/clustered SEs:**
   > "Illustrate: Standard SE gives p=0.02. Clustered SE gives p=0.08. The effect is less certain than naive analysis suggests. Clustering matters!"

3. **Diagnostic checking:**
   > "Show example residual plots: Random scatter = good. Patterns = problems. If curved, might need Age²."

**Key teaching moment:**
> "Use examples to show why adjustment matters. The raw difference (5.2pp) overstated the effect. The adjusted estimate (2.9pp) is more credible because it accounts for confounders. Walk through the logic step-by-step on the board if needed."

### Interactions (2 min)

**Quick coverage:**

> "Sometimes treatment effects vary by subgroup. That's an interaction.
>
> **Model:** y = β₀ + β₁×Treatment + β₂×Age + β₃×(Treatment × Age) + error
>
> β₃ tells you: How does the treatment effect change with age?
>
> **Example:** If β₃ < 0, the campaign is more effective for younger people.
> - At age 20: effect ≈ β₁ + 20×β₃
> - At age 60: effect ≈ β₁ + 60×β₃
>
> This is called heterogeneous treatment effects or effect modification.
>
> **When to include:**
> - Pre-specified hypothesis (theory says effects differ by age)
> - Exploratory analysis (but be transparent!)
>
> **Avoid:** Testing dozens of interactions, reporting only 'significant' ones. That's p-hacking."

### Case Study Prompts (1 min)

**Quick discussion:**

**Q1:** "Unadjusted uplift is +5.2pp; adjusted is +2.9pp (SE 1.4pp). How do you report this?"

**Good answer:**
> "After accounting for age and device, the campaign increased participation by 2.9pp (95% CI: 0.1pp to 5.7pp). This is meaningful though smaller than the raw difference, which partially reflected that younger people were more exposed."

**Q2:** "Adding Age² improves R² but β₁ stays similar. What does this suggest?"

**Answer:**
> "Age² helps predict participation (better fit) but isn't a confounder. It refines the model without changing the treatment effect. Confounding vs functional form distinction."

### When Regression Isn't Enough (2 min)

**Brief overview of advanced methods:**

> "Regression assumes:
> - No unmeasured confounders
> - Correct functional form
> - Linear-additive effects
>
> If these fail, consider:
> - **Instrumental Variables:** Use an external factor that affects treatment but not outcome directly
> - **Difference-in-Differences:** Compare treatment group's change to control group's change
> - **Regression Discontinuity:** Exploit assignment thresholds (age 18, income <£20k)
> - **Propensity Score Matching:** Balance groups on observables first
>
> These are advanced (2-hour workshops each!), but know they exist. When regression isn't enough, better design or quasi-experimental methods are your friends."

### Key Takeaway: Part 4 (1 min)

**Read the slide:**
> "Regression estimates treatment effects while adjusting for confounders. Always interpret in context, check assumptions, use robust/clustered SEs.
>
> **Best practices:**
> 1. Pre-specify covariates
> 2. Check diagnostics
> 3. Use clustered SEs if grouped data
> 4. Report adjusted estimates with CIs
> 5. Be honest about potential unmeasured confounders"

**Transition:**
> "So far, everything has been frequentist - p-values, confidence intervals, hypothesis tests. But there's another paradigm: Bayesian. Let's zoom out and see how it differs..."

---

## Part 5: Bayesian Zoom-Out (10 minutes)

### The Limitation of Frequentism (2 min)

**Set up the contrast:**

**What to say:**
> "Throughout today, we've used frequentist inference:
> - Fixed true parameter (e.g., treatment effect)
> - Probability statements about DATA: 'If null true, 5% chance of data this extreme'
> - Confidence intervals: 'Procedure has 95% coverage'
>
> But here's what you CAN'T say in frequentism:
> ❌ '95% probability the effect is positive'
> ❌ '95% chance the parameter is in this interval'
>
> Bayesian inference flips this:
> - Parameters are uncertain (have distributions)
> - Probability statements about PARAMETERS: '95% probability effect is between X and Y'
> - Direct answers to questions like 'What's the probability scaling would be worthwhile?'
>
> Neither is 'right' or 'wrong' - they answer different questions."

**Example to illustrate:**
> "Frequentist CI: 'If we repeated this study many times, 95% of CIs would contain the true effect.'
> - Statement about a procedure
> - Can't say anything about THIS particular CI
>
> Bayesian Credible Interval: 'Given our data, 95% probability the effect is in this range.'
> - Direct statement about the parameter
> - This is what people intuitively THINK frequentist CIs mean!"

### Bayes' Theorem (2 min)

**Show the formula but emphasize intuition:**

**What to say:**
> "At the heart of Bayesian thinking is Bayes' theorem. It formalizes how to update beliefs with evidence.
>
> **[Point to formula]**
>
> In plain English:
> - **Prior:** What we believed before seeing data
> - **Likelihood:** How consistent data is with each possible effect size
> - **Posterior:** Updated belief after seeing data
>
> This is how humans naturally think! 'I thought the campaign would help by ~2pp. Data shows 3.8pp. Now I believe it's probably 3-4pp.'
>
> The formula looks intimidating, but conceptually it's: prior belief + new evidence = updated belief."

**Address the elephant in the room:**
> "The controversial part: Where does the prior come from?
> - Subjective: Expert judgment, theory
> - Objective: Past data from similar contexts
> - Weakly informative: Regularization, prevent overfitting
>
> Good news: With lots of data, the prior doesn't matter much. Data overwhelms it. With little data, the prior has more influence."

### Toy Example: Beta-Binomial (2 min)

**Make this concrete:**

**What to say:**
> "Simplest Bayesian model: Beta-Binomial, perfect for proportions.
>
> **Scenario:** Other councils suggest emails usually increase response by 0-5pp.
>
> **Model:**
> - Prior: Response rate p ~ Beta(a, b) - flexible distribution on [0,1]
> - Data: x responses out of n emails
> - Posterior: p | Data ~ Beta(a+x, b+n-x)
>
> The beauty: The posterior is also Beta! Analytically tractable, no simulation needed.
>
> **Example:**
> - Prior: Beta(45, 55) → expect ~45% response
> - Data: 58 responses out of 100 → 58% observed
> - Posterior: Beta(103, 97) → expect ~52% response
>
> The posterior is a compromise between prior and data. With more data, data dominates."

**Key insight:**
> "Credible interval: Take 95% of posterior mass. Direct interpretation: '95% probability true response rate is between 50% and 54%.' Much more intuitive than frequentist CI!"

### Prior Selection (2 min)

**Types of priors:**

> "**1. Uninformative:** Flat prior (Beta(1,1)) - let data speak. Use when:
> - First study in new area
> - Very large dataset
> - Want to match frequentist results
>
> **2. Weakly informative:** Regularize, prevent extreme estimates. Use when:
> - Moderate data
> - Want to rule out implausible values (e.g., 99% response rate)
>
> **3. Informative:** Based on past studies, theory. Use when:
> - Rich prior data from similar contexts
> - Sequential trials (posterior from trial 1 = prior for trial 2)
>
> **Best practice:** 
> - Be transparent about prior choice
> - Run sensitivity analysis: How do results change with different priors?
> - In civic tech: Use priors from similar interventions when available"

**Address criticism:**
> "'Priors are subjective!' Yes, but so are modeling choices in frequentist analysis (which covariates, transformations). At least Bayesian is transparent.
>
> Sensitivity analysis is key: Show results under multiple priors. If similar → robust. If different → data is weak, be honest about uncertainty."

### Credible vs Confidence Intervals (1 min)

**Drive home the difference:**

> "**95% Confidence Interval (frequentist):**
> 'If we repeated the study many times, 95% of intervals would contain the true parameter'
> - Statement about the PROCEDURE
> - Tortured interpretation
>
> **95% Credible Interval (Bayesian):**
> 'There's 95% probability the parameter is in this interval'
> - Direct statement about the PARAMETER  
> - Says exactly what people want
>
> For decision-making, Bayesian is more intuitive: 'Should we scale?' → 'Yes, 97% probability it increases participation.'"

**Caveat:**
> "Bayesian interpretation is conditional on your prior being reasonable. Garbage prior → garbage posterior."

### When Bayesian Helps (1 min)

**Quick coverage:**

> "Bayesian shines when:
> - **Small samples:** Incorporate prior knowledge
> - **Sequential testing:** Update beliefs as data comes in
> - **Decision analysis:** Compute probability of meeting threshold
> - **Complex models:** Hierarchy, missing data (MCMC handles these)
>
> Example: 'What's probability the campaign increases response by ≥3pp?' Integrate posterior above 3pp. Direct answer!
>
> Downsides:
> - Computationally harder (MCMC)
> - Prior specification (controversial)
> - Less familiar to reviewers
>
> Use when it adds value: small n, sequential, decision-focused."

### Teaching Bayesian Concepts (2-3 min if time)

**Note:** This section describes concepts that would ideally be shown with an interactive Bayes Updater tool. Since this tool is not yet implemented, illustrate these concepts on the board or with pre-made examples.

**Concepts to demonstrate:**

1. **Optimistic prior (Beta(40,20)):**
   > "Draw on board: Prior expects 67% response. Add data: 58/100 observed. Show how posterior shifts down toward 60%. Data corrects our optimism."

2. **Skeptical prior (Beta(10,40)):**
   > "By contrast, skeptical prior expects only 20%. Same data: 58/100. Posterior shifts up toward 50%. Data corrects skepticism."

3. **Flat/uninformative prior (Beta(1,1)):**
   > "With no prior belief, data dominates. 58/100 observed → posterior centers near 58%."

**Key insight:**
> "Sketch the curves on the board to show: With strong data (large n), prior doesn't matter much. With weak data (small n), prior matters a lot. This is honest about information content. The visualization would show the prior, likelihood, and posterior curves converging."

### Case Study Prompts (brief)

**Q1:** "Skeptical prior at +1pp, observe +3.2pp (n=400). Does posterior support positive effect?"

**Answer:**
> "With moderate data (n=400), posterior will shift toward 2-2.5pp. 95% CrI probably [0.5pp, 4.5pp]. Interpretation: 'Despite skeptical prior, strong evidence for positive effect (98% probability > 0).'"

### Key Takeaway: Part 5 (1 min)

**Read the slide:**
> "Bayesian lets you make direct probability statements about parameters. Especially useful for small samples, sequential testing, decision analysis.
>
> Both paradigms have strengths:
> - Frequentist: Established, familiar, no priors needed
> - Bayesian: Intuitive probabilities, incorporates prior knowledge, good for decisions
>
> In practice: Use frequentist as default. Add Bayesian for sensitivity/decision analysis when valuable."

**Transition:**
> "That completes our statistical journey. Let's wrap up with key takeaways and common pitfalls..."

---

## Part 6: Wrap & Q/A (5 minutes)

### Cross-Cutting Pitfalls (1 min)

**Run through quickly:**

> "Common mistakes in evaluation - all avoidable:
> 1. **Multiple comparisons:** Test 20 things, report 1 'significant' → false positive
> 2. **p-hacking:** Already covered. Use pre-registration!
> 3. **Regression to the mean:** Target worst performers, they improve anyway (not your program)
> 4. **Measurement drift:** Definition changes mid-study
> 5. **Ignoring clustering:** SEs too small, false positives
>
> Prevention: Pre-register, use robust methods, be transparent."

### Good Practice Checklist (1 min)

**This is their takeaway:**

> "**Design phase:**
> ✅ Pre-register outcomes and analysis plan
> ✅ Calculate sample size (power analysis)
> ✅ Plan for covariates
>
> **Analysis phase:**
> ✅ Report effect sizes with CIs
> ✅ Use robust/clustered SEs
> ✅ Check diagnostics
> ✅ Stick to pre-specified analyses
>
> **Reporting phase:**
> ✅ Transparent about limitations
> ✅ Share data/code where possible
> ✅ Plain-language interpretation
> ✅ Acknowledge what you DON'T know
>
> Print this. Use it for every evaluation."

### Tools & Resources (1 min)

**Point to the slide:**

> "All interactive tools from today will be available after the session. Use them for your own work.
>
> **Further reading:** Three books I recommend:
> - Gelman & Hill: Best applied regression
> - McElreath: Best Bayesian intro
> - Gerber & Green: Gold standard for RCTs
>
> Don't just read - PRACTICE. Use these methods on your data. Make mistakes, learn, iterate."

### Exit Tickets (1 min)

**If time permits:**

> "Before you leave, two quick questions to check understanding:
>
> 1. Write a one-sentence interpretation of a 95% CI for +3.5pp, CI [0.2pp, 6.8pp]
> 2. Name one design change to increase power without inflating α
>
> This helps me see what landed and what needs follow-up."

### Q&A (remaining time)

**Open floor:**

> "Open for questions on any part of the session."

**Have prepared answers for common questions:**

**"When Bayesian vs frequentist?"**
> "Default to frequentist (more standard). Use Bayesian when you have small n, strong priors, or need decision probabilities."

**"Small sample sizes?"**
> "Be honest about uncertainty (wide CIs). Don't over-interpret. Consider Bayesian with informative priors. Or just collect more data."

**"Can't randomize?"**
> "Use quasi-experimental methods (DiD, RD, IV). Regression with good covariates. Be careful about causal claims. Sensitivity analyses."

**"Explain to non-technical stakeholders?"**
> "Focus on effect size and CI, not p-values. Use visuals. Plain language: 'increased by Xpp' not 'β=X, p<0.05'. Tell the story."

### Final Takeaways (1 min)

**Recap the five key points:**

> "**1. Distributions & LLN:** Variation is normal. More data → less uncertainty.
> **2. p-values & CIs:** Effect size + CI > binary significance.
> **3. Power:** Design for the minimum effect that matters.
> **4. Regression:** Adjust for confounders, check assumptions, use robust SEs.
> **5. Bayesian:** Direct probability statements, incorporate prior knowledge.
>
> **Remember:** Good statistics makes good evaluation possible. Good evaluation makes good decisions possible.
>
> You don't need to be a statistician, but you do need:
> - Clear questions
> - Appropriate methods
> - Honest reporting
> - Humility about what you don't know"

### Thank You (30 sec)

> "Thank you all! Slides and tools will be shared via [platform]. Reach out anytime with questions. The best way to learn is by doing - go evaluate something, make mistakes, iterate. That's how we all improve.
>
> **[Applause, exit]**"

---

## Post-Session Tips

### Immediate Follow-Up (within 24 hours)
- Share slides and tool links via course platform
- Send summary email with key resources
- Collect and review exit ticket responses
- Note which concepts seemed unclear for future sessions

### Common Questions to Anticipate

1. **"Do I need to learn R/Python?"**
   - Answer: Helpful but not required. Many tools have point-and-click interfaces. But code helps with transparency and reproducibility.

2. **"What if my boss wants p<0.05 or nothing?"**
   - Answer: Educate them gently. Share this session! Emphasize: effect size matters, CIs are more informative. P-values alone are insufficient.

3. **"Can I use these methods for qualitative evaluation?"**
   - Answer: These are quantitative methods. But mixed-methods is powerful - use qual to generate hypotheses, quant to test them.

4. **"What sample size do I need for MY study?"**
   - Answer: Depends on your MDE, baseline rate, power, α. Use the calculator we showed. Happy to help you work through it.

### Self-Reflection After Teaching

- What parts ran long? (common: regression section)
- What parts did students struggle with? (common: p-value interpretation, Bayesian priors)
- Which demos worked well? Which need improvement?
- Did you hit the key learning goals?
- What would you change for next time?

---

## Emergency Backup Plans

### If Interactive Demos Don't Work
- Have static screenshots of demo outputs
- Walk through examples on the board
- Use pre-computed examples in slides

### If Running Behind Schedule
**Priority cuts** (in order):
1. Bayesian section → reduce to 5 min overview
2. Regression interactions → skip or mention briefly
3. Extended Q&A → defer to office hours

**Never cut:**
- Part 1 (foundation)
- p-hacking demo (too important)
- Power calculator (too practical)

### If Running Ahead
**Extension opportunities:**
1. Deeper Q&A
2. Work through participant's real examples
3. More detail on quasi-experimental methods
4. Discussion of recent evaluation examples from civic tech

---

## Additional Teaching Notes

### Energy Management
- **High energy:** Opening, demos, key takeaways
- **Medium energy:** Formula explanations, diagnostics
- **Pause points:** After each major section, after complex concepts

### Whiteboard Strategy
- Sketch distributions and sampling distributions
- Draw the null distribution with p-value as tail area
- Illustrate power curves
- Show residual plot examples

### Engagement Techniques
- Ask questions frequently
- Invite predictions before showing demo results
- Acknowledge confusion ("This is tricky - that's normal!")
- Use real civic tech examples from the room if possible

### Accessibility Considerations
- Speak clearly, not too fast
- Repeat questions before answering
- Use multiple modalities (visual, verbal, interactive)
- Provide formulas but emphasize intuition
- Check for understanding regularly
