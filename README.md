# Sutra: Modern Lockscreen Wisdom & Status Creator

> Bridging sacred timeless wisdom (*Bhagavad Gita, Hanuman Chalisa, Ramcharitmanas*) and modern viral reflections directly to your lock screen with an anti-cliché, luxury minimalist aesthetic.

---

## 📂 Project Structure

```
F:\App dev\practice\Sutra\
├── admin-panel/        # React 18 + Vite + Tailwind CSS Admin Dashboard
│   ├── src/
│   │   ├── firebase/   # Connected to 'daily-slok' Cloud Firestore
│   │   ├── data/       # Pre-loaded master seed catalog & 4K wallpapers
│   │   ├── context/    # Zero-read packaging engine & CRUD state
│   │   └── components/ # Dashboard, Shloka Table, Add/Edit Studio, Wallpapers
│   └── .env            # Firebase project configuration
│
└── mobile_app/         # Flutter Mobile App (Android & Cross-platform)
    ├── assets/data/    # Bundled offline seed database (0 initial reads)
    ├── lib/
    │   ├── models/     # ShlokaModel & UserSettingsModel
    │   ├── services/   # Local Storage & Firebase zero-cost sync
    │   ├── theme/      # Dark Luxury theme (Obsidian slate & Champagne gold)
    │   └── screens/    # 6 Core Screens (Welcome, Onboarding, Home, Studio, Story, Settings)
    └── pubspec.yaml    # Flutter dependencies
```

---

## 🚀 How to Run

### 1. React Web Admin Panel
The admin panel is configured with your Firebase project (`daily-slok`) and pre-loaded with sacred scriptures and modern quotes.

```bash
cd "F:\App dev\practice\Sutra\admin-panel"
npm install
npm run dev
```
👉 Open: **[http://localhost:5173/](http://localhost:5173/)**

* **Features:**
  * View, search, and edit pre-loaded verses from the Gita, Chalisa, and Ramayana.
  * Add modern/viral thoughts without Sanskrit.
  * Preview lockscreen readability on 4K atmospheric wallpapers.
  * "Publish & Sync App" button that bundles 100 quotes into 1 document (saving 99% Firebase reads).

---

### 2. Flutter Mobile Application
The mobile app runs offline-first with pre-cached local data and connects to the `daily-slok` Firestore backend.

```bash
cd "F:\App dev\practice\Sutra\mobile_app"
flutter run
```
*(Or launch an emulator using `flutter emulators --launch Medium_Phone` and run `flutter run`)*

* **Screens Implemented:**
  1. **`SCR-01` Welcome & Auth:** Instant 1-tap "Continue as Guest" + Google Sign-In.
  2. **`SCR-02` Onboarding Check-In:** Emotional mood selection (*Demotivated, Lonely, Anxious, Seeking Peace, Need Focus, Facing Loss*) + Wake-Up Time selector.
  3. **`SCR-03` Home Sanctuary:** Today's anchor shloka, source filter pills, quick mood switcher, instant reload button, and bottom AdMob container.
  4. **`SCR-04` Lockscreen & Widget Studio:** Real-time sliders for font size, card opacity, corner radius, and 4K wallpaper picker.
  5. **`SCR-05` Story & Status Creator:** 9:16 vertical canvas with background dimming slider, subtle "Created with Sutra" watermark, and direct WhatsApp Status share.
  6. **`SCR-06` Settings & Preferences:** Sanskrit/Awadhi toggle, active schedule window (Wake-up to 10 PM), and battery optimization guide.

---

## ⚡ Zero-Read Database Architecture
* **Firebase Free Tier:** 50,000 reads/day.
* **Sutra Optimization:** 
  1. The app bundles 100 shlokas per category into a single Firestore document.
  2. The mobile app downloads the bundle once and reads directly from local storage.
  3. The 30-minute lockscreen rotation runs 100% locally with **0 database reads** and **0 battery waste**.
  4. Supports **up to 500,000 active users** completely free on the Spark tier!
