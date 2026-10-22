# BrewLab — Your Personal Coffee Lab

BrewLab is an independent coffee brewing calculator and tasting journal, designed for Android through Capacitor. It is separate from the Nongki project and does not connect to Nongki's backend.

## Features
- Recipe starting points for Timemore B75, Hario V60, Hario Switch, Orea, AeroPress, and moka pot.
- Inputs for bean type, process, roast, brewing method, grinder, dose, and flavor goal.
- Calculates water weight, ratio, temperature, and a grinder starting point where calibrated.
- Brew timer and staged recipe guide.
- Local tasting journal with simple next-experiment suggestions.
- Dark charcoal interface with muted gold accents. Tasting entries remain on this device.

## Run locally
Requires Node.js 22+.

```sh
npm install
npm test
npm run build
```

## Build Android APK
The GitHub Actions workflow **Build BrewLab Android APK** runs on pushes to `main` and can also be started manually from the Actions tab. It installs Android SDK API 35 and Build Tools 35 explicitly before building. On success, download the `BrewLab-debug-apk` artifact from that workflow run. This is a debug APK, not a Play Store release.

## Brewing calibration
Recipe values are starting recommendations, not guaranteed ideal settings. Grinder click counts depend on the grinder's zero-point and calibration. Record tasting outcomes and change one parameter at a time.

## Current scope
Tasting entries are stored locally. Cloud sync, user accounts, and export are not implemented. No personal or Nongki credentials are required.