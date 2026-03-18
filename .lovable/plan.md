

# Plan : Fix sample order creation (floating point + integer column)

## Root cause

The edge function logs reveal two errors when creating sample orders:

1. **Stripe rejects** `unit_amount: 569.9999999999999` — it needs an integer (cents)
2. **Postgres rejects** `amount: 5.699999999999999` — the `orders.amount` column is type `integer`, but sample totals are decimals (e.g. 2.85€ × 2)

Both stem from floating-point arithmetic on decimal sample prices.

## Fixes

### 1. `supabase/functions/create-checkout/index.ts`

Round `finalAmount * 100` to integer for Stripe:
```ts
unit_amount: Math.round(finalAmount * 100),
```

Round `finalAmount` for DB inserts (both the transfer/check path and the card path):
```ts
amount: Math.round(finalAmount),
```

This applies to both insert locations (the `insertOrderAndLead` helper and the direct card-path insert).

### 2. Consider: should `amount` support cents?

The `orders.amount` column is `integer` (storing euros, not cents). For store orders (hundreds/thousands of euros), this is fine. For sample orders (e.g. 5.70€), rounding to 6€ loses precision.

**Two options:**
- **Quick fix (recommended now)**: Use `Math.round()` — acceptable since sample prices are typically whole numbers or close to it, and Stripe handles the exact cents amount correctly
- **Proper fix (later)**: Migrate `amount` to `numeric` or store cents as integer — requires updating all amount displays across admin

### Files modified

| File | Change |
|---|---|
| `supabase/functions/create-checkout/index.ts` | `Math.round()` on Stripe `unit_amount` and DB `amount` inserts |

One-line fix in 3 places within the same file. Edge function redeploy required.

