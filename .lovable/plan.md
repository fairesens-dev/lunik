

## Plan: AI-Powered Chat Widget

### Overview

Replace `ContactWidget.tsx` with a 4-screen AI chatbot widget. Create an edge function for AI chat using Lovable AI gateway (LOVABLE_API_KEY already configured). Add new enum values for proper activity tracking.

### Database migration

Add enum values to `activity_type` and `contact_source`:

```sql
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'chatbot_conversation';
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'sav_request';
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'callback_request';
ALTER TYPE public.contact_source ADD VALUE IF NOT EXISTS 'sav_widget';
ALTER TYPE public.contact_source ADD VALUE IF NOT EXISTS 'callback_widget';
```

### Edge function: `supabase/functions/widget-chat/index.ts`

- Uses Lovable AI gateway with `google/gemini-3-flash-preview`
- System prompt with LuniK knowledge base (products, shipping, returns, payments)
- Streaming SSE response
- `verify_jwt = false` in config.toml

### Files

| File | Action |
|---|---|
| `src/components/ContactWidget.tsx` | **Rewrite** — Full 4-screen widget |
| `supabase/functions/widget-chat/index.ts` | **Create** — AI chat edge function |
| `supabase/config.toml` | **Update** — Add widget-chat function |

### Widget structure (single file, ~500 lines)

**State machine**: `screen` = `menu` | `ai_chat` | `sav` | `callback`

**Screen 1 — Menu**: 3 cards (Poser une question, SAV, Être rappelé) with icons and subtitles.

**Screen 2 — AI Chat**:
- Chat messages array in state, persisted to `sessionStorage` key `chatbot_session`
- Streaming via SSE from `widget-chat` edge function
- Typing indicator (animated dots) while streaming
- 20-message limit, then prompt callback
- If AI mentions "rappeler"/"contacter", show inline callback button
- On unmount/close, save transcript to `activities` table (type: `chatbot_conversation`)

**Screen 3 — SAV Flow**:
- Step-by-step guided questions rendered as chat bubbles
- Q1: order number (free text) → Q2: problem type (button choices) → Q3: conditional detail → Q4: email → Q5: phone (optional)
- Summary card at end
- On submit: upsert contact, insert activity (type: `sav_request`), insert conversion

**Screen 4 — Callback Form**:
- Fields: Prénom, Téléphone (FR validation), Ville, RGPD checkbox
- On submit: upsert contact, save RGPD consent as contact_property, insert activity + conversion
- Success screen with personalized message

### Visual specs
- Width: 360px desktop, full-screen mobile
- Header: `bg-[#1a4a42]` dark teal, white text, green dot "En ligne"
- Chat bubbles: user = teal bg right-aligned, AI = grey bg left-aligned
- Pulse animation on button until first open (tracked via `sessionStorage`)
- Framer-motion slide-up/down
- ESC key closes, aria-labels on interactive elements

### AI system prompt (in edge function)
French-language assistant for LuniK (stores bannes sur-mesure). Knowledge base includes shipping (4-5 weeks), returns (30 days), payment options (CB, virement, 3x sans frais), warranty (5 years), Somfy motorization, Dickson fabric, 173 colors.

