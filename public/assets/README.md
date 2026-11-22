# QuickBite Asset Organization & Google Flow Integration Guide

This directory holds visual assets, videos, poster fallbacks, and Google Flow animations.

### Directory Structure:
- `hero/`
  - `hero-loop.mp4` / `hero-loop.webm` (Cinematic hero food video or Google Flow animation)
  - `hero-poster.jpg` (Poster image loaded before video or when reduced motion is preferred)
- `food/`
  - High-resolution dish photography and signature dish showcase clips
- `story/`
  - `story-craving.mp4` / `story-craving.jpg` (Stage 1: Discover Craving)
  - `story-kitchen.mp4` / `story-kitchen.jpg` (Stage 2: Kitchen Orchestration)
  - `story-delivery.mp4` / `story-delivery.jpg` (Stage 3: High-speed Delivery)
- `restaurant/`
  - Restaurant partner imagery and dashboard visuals

### How to Replace Assets:
The `<CinematicVideo />` component (`src/components/common/CinematicVideo.tsx`) automatically detects whether local video files exist.
If the video file is present, it smoothly autoplays muted in an inline loop; if missing or if the user enabled `prefers-reduced-motion`, it gracefully falls back to the curated high-definition photography poster without console errors!
