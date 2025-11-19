# Law of Assumption - Architecture

## 🎯 Feature Isolation Architecture

This project uses **Feature Isolation** for clean, AI-assisted development.

### Why Feature Isolation?
✅ **AI works safer** - All code for a feature in one folder
✅ **Deletable** - Remove feature = remove folder
✅ **Parallel development** - Multiple devs work without conflicts
✅ **No accidental imports** - Features can't import from each other
✅ **Incremental shipping** - Build features in parallel without breaking each other

---

## 📁 Project Structure

```
src/
├── features/
│   ├── core-visualization/        # Starfield + phase system (SHIPPED ✅)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── sats-mode/                  # State Akin To Sleep ending phase
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── vision-persistence/         # localStorage + vision history
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── neville-quotes/             # Random Neville Goddard quotes
│       ├── components/
│       ├── data/
│       ├── hooks/
│       └── index.ts
│
├── lib/
│   ├── featureConfig.ts           # Feature flags
│   └── utils/                     # Shared utilities
│
├── components/
│   └── FeatureGate.tsx            # Feature flag wrapper
│
└── App.tsx                         # Main app (orchestrates features)
```

---

## 🚀 Feature Development Workflow

### Step 1: Create feature branch
```bash
git checkout -b feature/my-feature-name
```

### Step 2: Create feature folder
```bash
mkdir -p src/features/my-feature/{components,hooks,services}
```

### Step 3: Build feature (isolated)
- Keep ALL feature code in its folder
- Export via `index.ts` (public API)
- Use shared utilities from `/lib`
- Add feature flag to `featureConfig.ts`

### Step 4: Test locally
```bash
npm run dev
# Test feature in isolation
```

### Step 5: Request review
- Ask user to test: "Can you test this feature?"
- User provides feedback

### Step 6: Merge to main
```bash
git checkout main
git merge feature/my-feature-name
git push
```

### Step 7: Enable feature (when ready)
```typescript
// src/lib/featureConfig.ts
export const features = {
  myFeature: true  // Enable in production
}
```

---

## 🎨 Feature Structure Template

Every feature follows this structure:

```
src/features/{feature-name}/
├── components/          # UI components (TSX files)
│   └── MyComponent.tsx
├── hooks/               # React hooks
│   └── useMyFeature.ts
├── services/            # Business logic, API calls
│   └── myFeatureService.ts
├── data/                # Static data (optional)
│   └── constants.ts
├── types.ts             # TypeScript types
└── index.ts             # Public API (what can be imported)
```

---

## 📋 Feature Isolation Rules

### ✅ DO:
- Keep ALL feature code in its folder
- Export via `index.ts` (public API)
- Use shared utilities from `/lib`
- Write features behind feature flags
- Use `FeatureGate` to wrap UI

### ❌ DON'T:
- Import from other features directly
- Put feature code in `/lib` or `/hooks`
- Export internal implementation details
- Mix features in same file
- Skip feature flags for new features

---

## 🔥 Current Features

### ✅ Core Visualization (Shipped)
**Status:** Production ✅
**Flag:** `coreVisualization: true`
**Location:** `src/features/core-visualization/`

**Components:**
- Starfield canvas with 100 stars
- 4-phase system (silence → breath → awakening → ready)
- Vision input textarea
- "Begin Simulation" button
- Generative ambient audio (40Hz drone)

---

### 🚧 SATS Mode (In Development)
**Status:** Todo
**Flag:** `satsMode: false`
**Branch:** `feature/sats-mode`
**Location:** `src/features/sats-mode/`

**What it does:**
- Adds ending phase after simulation
- Stars slow to near-stillness
- Text overlay: "Close your eyes. Assume the feeling. It is done."
- Audio fades to whisper
- 20-second meditation, then fade to black

**Why:** Core Neville Goddard "State Akin To Sleep" technique

---

### 🚧 Vision Persistence (In Development)
**Status:** Todo
**Flag:** `visionPersistence: false`
**Branch:** `feature/vision-persistence`
**Location:** `src/features/vision-persistence/`

**What it does:**
- Saves user's vision text to localStorage
- Auto-loads on mount
- Persists across sessions
- Optional: Clear vision button

**Why:** Users return daily - must remember their vision!

---

### 🚧 Neville Quotes (In Development)
**Status:** Todo
**Flag:** `nevilleQuotes: false`
**Branch:** `feature/neville-quotes`
**Location:** `src/features/neville-quotes/`

**What it does:**
- Displays random Neville Goddard quote
- Shows below vision input
- Rotates on each visit
- Educational + credibility

**Examples:**
- "Assume the feeling of your wish fulfilled"
- "Live in the end"
- "Imagination creates reality"

---

## 🎯 Feature Flags

Located in: `src/lib/featureConfig.ts`

```typescript
export const features = {
  // Core (shipped)
  coreVisualization: true,

  // Phase 1 MVP features
  satsMode: false,
  visionPersistence: false,
  nevilleQuotes: false,

  // Phase 2 (future)
  visionJournal: false,
  guidedAudio: false,
  socialSharing: false,
}
```

**Usage:**
```tsx
import { FeatureGate } from '@/components/FeatureGate'

<FeatureGate feature="satsMode">
  <SATSModeComponent />
</FeatureGate>
```

---

## 🔄 Branch Strategy

### Main Branch
- `main` - Production code, always deployable

### Feature Branches
- `feature/setup-architecture` - Initial feature isolation setup
- `feature/sats-mode` - SATS ending phase
- `feature/vision-persistence` - localStorage vision saving
- `feature/neville-quotes` - Random Neville quotes
- `feature/vision-journal` - Multiple visions with history
- `feature/guided-audio` - Voice-guided meditation
- `feature/social-sharing` - Share functionality

### Workflow
1. Create feature branch from `main`
2. Build feature in isolation
3. Test locally
4. Ask user to test
5. Merge to `main` (no PR needed)
6. Enable feature flag when ready

---

## 🚀 Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:5173
```

### Production Build
```bash
npm run build
# Creates /dist folder
```

### Deploy to Vercel/Netlify
```bash
# Connect to lawofassumption.xyz
vercel --prod
# or
netlify deploy --prod
```

---

## 📊 Feature Status

| Feature | Status | Branch | Flag |
|---------|--------|--------|------|
| Core Visualization | ✅ Shipped | `main` | `true` |
| SATS Mode | 🚧 Todo | `feature/sats-mode` | `false` |
| Vision Persistence | 🚧 Todo | `feature/vision-persistence` | `false` |
| Neville Quotes | 🚧 Todo | `feature/neville-quotes` | `false` |
| Vision Journal | 📋 Planned | TBD | `false` |
| Guided Audio | 📋 Planned | TBD | `false` |
| Social Sharing | 📋 Planned | TBD | `false` |

---

## 🎯 AI Development Instructions

When working on a feature:

1. **Check out feature branch:**
   ```bash
   git checkout feature/{feature-name}
   ```

2. **Work ONLY in feature folder:**
   ```
   src/features/{feature-name}/
   ```

3. **Export via index.ts:**
   ```typescript
   export { MyComponent } from './components/MyComponent'
   export { useMyFeature } from './hooks/useMyFeature'
   ```

4. **Add feature flag:**
   ```typescript
   // src/lib/featureConfig.ts
   myFeature: false
   ```

5. **Use FeatureGate in App.tsx:**
   ```tsx
   <FeatureGate feature="myFeature">
     <MyFeature />
   </FeatureGate>
   ```

6. **Test, get approval, merge:**
   ```bash
   git checkout main
   git merge feature/{feature-name}
   git push
   ```

---

## 🔥 Next Steps

### Phase 1: Setup (Now)
- [x] Create ARCHITECTURE.md
- [ ] Create `feature/setup-architecture` branch
- [ ] Set up feature folders
- [ ] Create `featureConfig.ts`
- [ ] Create `FeatureGate.tsx`
- [ ] Refactor existing code to `core-visualization/`
- [ ] Merge to main

### Phase 2: SATS Mode
- [ ] Create `feature/sats-mode` branch
- [ ] Build SATS ending phase
- [ ] Test with user
- [ ] Merge to main
- [ ] Enable flag

### Phase 3: Vision Persistence
- [ ] Create `feature/vision-persistence` branch
- [ ] Build localStorage hooks
- [ ] Test with user
- [ ] Merge to main
- [ ] Enable flag

### Phase 4: Neville Quotes
- [ ] Create `feature/neville-quotes` branch
- [ ] Add 20+ quotes
- [ ] Build random selector
- [ ] Test with user
- [ ] Merge to main
- [ ] Enable flag

---

**Happy shipping! One feature at a time.** 🚀
