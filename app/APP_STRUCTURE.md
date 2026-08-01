# App Directory Structure

```text
app/
├── _layout.tsx
├── APP_STRUCTURE.md
├── (auth)/
│   └── onboarding/
│       └── index.tsx
├── (share)/
│   └── receive/
│       └── index.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── plans.tsx
│   ├── community.tsx
│   ├── explore.tsx
│   └── settings.tsx
├── places/
│   ├── recent/
│   │   └── index.tsx
│   └── [placeId]/
│       └── index.tsx
├── plans/
│   ├── new/
│   │   └── index.tsx
│   └── [planId]/
│       ├── index.tsx
│       ├── map/
│       │   └── index.tsx
│       ├── agent/
│       │   └── index.tsx
│       └── share/
│           └── index.tsx
└── community/
    ├── posts/
    │   └── [postId]/
    │       └── index.tsx
    └── market/
        ├── index.tsx
        ├── register/
        │   └── index.tsx
        └── [marketPlanId]/
            ├── index.tsx
            └── credits/
                └── index.tsx
```
