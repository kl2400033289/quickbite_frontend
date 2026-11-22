# QuickBite — Frontend Documentation & Integration Guide
**Project Code:** PS014  
**Project Title:** Demand-Driven Food Delivery & Order Orchestration System  
**Framework:** React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide React  

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The application will launch at: **`http://localhost:5173`**

---

## 2. Architecture & Backend Microservices Integration

The frontend connects directly through the **API Gateway** on port `8080` (or uses the Vite proxy `/api` pointing to `http://localhost:8080`), preserving all microservices contracts:

| Microservice | Internal Port | Gateway Route | Endpoints Implemented |
|---|---|---|---|
| **API Gateway** | `8080` | `/*` | Central routing and discovery proxy |
| **Auth Service** | `8081` | `/api/auth/**` | `POST /register`, `POST /login`, `GET /me` (Stateless JWT) |
| **Restaurant Service** | `8082` | `/api/restaurants/**` | `GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`, `GET /{id}/menu`, `POST /{id}/menu`, `PUT /{id}/menu/{itemId}`, `DELETE /{id}/menu/{itemId}`, `POST /{id}/orders/{orderId}/accept`, `POST /{id}/orders/{orderId}/reject` |
| **Order Service** | `8083` | `/api/orders/**` | `GET /`, `GET /{orderId}`, `GET /user/{userId}`, `GET /restaurant/{restaurantId}`, `POST /` (automatically calls Payment via Feign), `PUT /{orderId}/status` |
| **Payment Service** | `8084` | `/api/payments/**` | `POST /` (`{ orderId, amount }` -> returns `{ paymentId, paymentStatus }`) |
| **Eureka Server** | `8761` | N/A | Service discovery registry |

### Offline / Fallback Mode
If the Spring Boot services or PostgreSQL instances are offline or unreachable, the frontend gracefully activates **Demo Fallback Mode** (`VITE_ENABLE_MOCK_FALLBACK=true`). A discreet status banner indicates whether the API Gateway is online or running in fallback mode, allowing offline demonstration without application crashes.

---

## 3. Implemented Routes & Features

### Customer Experience:
1. **Home (`/`)**:
   - **Section A**: Sticky responsive navigation with wordmark, search, cart count badge, and customer/operator persona toggle.
   - **Section B**: Cinematic hero section with editorial typography ("GOOD FOOD. ZERO FRICTION."), parallax visuals, and dedicated Google Flow asset slot.
   - **Section C**: Food discovery with cuisine filter chips and live search.
   - **Section D**: Featured restaurants spotlight with ratings, reviews, and signature dishes.
   - **Section E**: Signature dishes with instant add-to-tray feedback.
   - **Section F**: 3-Stage interactive scroll story (Craving -> Kitchen -> Delivery) with video slots and fallbacks.
   - **Section G**: 3-Step visual explanation of the orchestration process.
   - **Section H**: Restaurant Partner CTA.
   - **Section I**: Final call-to-action & enterprise footer.
2. **Explore Directory (`/explore`)**:
   - Filter by cuisine, search by keyword/location, sort by rating/speed, and filter 4.8+ ratings.
3. **Restaurant Details & Menu (`/restaurant/:id`)**:
   - Hero banner, menu category tabs, veg/non-veg tags, real-time quantity modifiers.
4. **Slide-Over Tray & Dedicated Cart (`/cart`)**:
   - Multi-restaurant cart protection, itemized pricing, automated GST (5%) & delivery calculations.
5. **Checkout (`/checkout`)**:
   - Delivery destination form validation, payment method selector (QuickBite Digital Pay, UPI, Card), and real-time order creation.
6. **Payment Result (`/payment-result`)**:
   - Real transaction confirmation and receipt details.
7. **Order Tracking (`/track/:orderId`)**:
   - Visual progress timeline (`PLACED` -> `ACCEPTED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`), live polling, and academic status progression simulator.
8. **Order History (`/orders`)**:
   - Past orders listing with status badges and reorder actions.
9. **Authentication (`/login`, `/signup`)**:
   - JWT authentication with 1-click test personas for quick evaluation.

### Restaurant Operator Experience:
10. **Operator Dashboard (`/dashboard`)**:
    - Real-time incoming order tickets.
    - Live **Accept Order** (`/orders/{orderId}/accept`) and **Reject Order** (`/orders/{orderId}/reject`) actions.
    - Menu management: List, Add Dish, Edit Dish, Delete Dish.
    - Multi-restaurant switcher and new kitchen registration.

---

## 4. Google Flow Asset Integration Guide

Visual animation assets and Google Flow video loops are organized under `public/assets/`:

- `public/assets/hero/`
  - `hero-loop.mp4` (Hero background video loop)
  - Poster fallback automatically loads if video is missing or if user prefers reduced motion.
- `public/assets/story/`
  - `story-craving.mp4` (Stage 1: Discover Craving)
  - `story-kitchen.mp4` (Stage 2: Kitchen Orchestration)
  - `story-delivery.mp4` (Stage 3: Valet Dispatch)
- `public/assets/food/`
  - High-resolution dish photography.
- `public/assets/restaurant/`
  - Restaurant imagery.

### How to Replace Assets:
Drop any MP4 or WebM video file into the corresponding folder with the matching name. The `<CinematicVideo />` component automatically detects and plays valid video files while seamlessly falling back to high-resolution photography without throwing browser console errors.
