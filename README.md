# BrewLab — Your Personal Coffee Lab

BrewLab is an independent coffee brewing calculator and tasting journal for Android via Capacitor. It is separate from Nongki and does not connect to Nongki's backend.

## Features
- Dose-scaled alternatives for Timemore B75, Hario V60, Hario Switch, OREA, AeroPress, and moka pot.
- Pour-over profiles with 3, 4, or 5 total additions (bloom included), cumulative gram targets, start times, estimated durations, and drawdown targets.
- Starting grind settings for Timemore C3S and Comandante C40 MK4; other grinders show grind texture rather than treating click counts as interchangeable.
- Inputs for roast, bean type, process, brewer, grinder, dose, flavor goal, water type, and filter-flow.
- Recipe-linked sources, adaptation notes, recipe-aware timer, and local tasting journal.

## Brewing source policy
Recipes are starting points, not guarantees. Published brewer recipes and equipment guidance are curated, and source-based methods are distinguished from adaptations. Dripper geometry, paper filter, coffee process/age, grind distribution, water composition, pour speed, and technique change drawdown. Grinder clicks are model- and zero-point-specific.

References:
- [Hario USA — James Hoffmann 1 Cup V60 Technique](https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-1-cup-v60-technique)
- [Hario UK — Expert V60 Brew Guide](https://www.hario.co.uk/pages/brew-guides-v60-expert)
- [OREA — V4 Guides and multi-pour recipes](https://www.orea.uk/guides-v4)
- [Hario Global — MUGEN SWITCH recipe PDF](https://global.hario.com/MUSD%20Recipe%20%26%20Interview.pdf)
- [AeroPress — official instructions](https://aeropress.com/pages/how-to-use)
- [Comandante — official grind-setting FAQ](https://comandantegrinder.com/pages/faq)
- [SCA Brewing Best Practices](https://www.scith.coffee/wp-content/uploads/2021/03/SCA-Protocols-_-Best-Practices.pdf)

B75 pulse options are adapted from published flat-bottom OREA patterns, not represented as official TIMEMORE recipes. Timings are targets; use actual drawdown and taste to dial in.

## Local setup and Android build
Requires Node.js 22+. Run `npm install`, `npm test`, and `npm run build`. GitHub Actions builds a debug APK on pushes to `main` or manual dispatch. Download the `BrewLab-debug-apk` artifact from a successful run.

## Data and privacy
Tasting entries are stored locally. Cloud sync, accounts, and export are not implemented. No Nongki credentials are required.
