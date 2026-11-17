# Security Specification for Deja Vu Restaurant Firestore Rules

## 1. Data Invariants
1. User profiles at `/users/{userId}` contain PII (`email`, `phone`, `addresses`) and loyalty point balances (`loyaltyPoints`, `totalPointsEarned`, `totalPointsRedeemed`). Only the authenticated owner (`request.auth.uid == userId`) can read or mutate their profile.
2. On user profile creation, `uid` must equal `request.auth.uid`, and initial `loyaltyPoints` must be `0` (cannot self-grant arbitrary starting points).
3. Orders at `/orders/{orderId}` must have a valid `id` matching `orderId`, `orderNumber`, non-negative `total`, valid `status` (`placed`, `grilling`, `out_for_delivery`, `delivered`), and bounded `items` list.
4. Order reads (`get` and `list`) are restricted to the order owner (`resource.data.userId == request.auth.uid`) so customer addresses and phone numbers cannot be scraped.
5. Order reviews (`rating`, `review`, `reviewedAt`) can only be submitted/updated by the order owner (`resource.data.userId == request.auth.uid`) with `rating` between `1` and `5` and `review` string length <= `500`, without modifying financial fields or `userId`.

## 2. Adversarial Payloads Guarded Against
1. Cross-user profile read (`/users/otherUid` get by attacker).
2. Unauthenticated or cross-user order list query (`/orders` list without `userId == auth.uid`).
3. Shadow field injection on profile create/update (`isAdmin: true`).
4. Negative total or negative loyalty discount injection on order create.
5. Rating out of range (`rating: 10` or `rating: 0`) or oversized review string (> 500 chars).
6. Mutating order `total` or `pointsEarned` during review update.
7. Oversized document ID injection (> 128 chars or special characters).
8. Unbounded `addresses` or `items` arrays (> 50 elements).
9. Modifying `uid` or `userId` on update.
10. Deleting orders or user profiles from client.
11. Unverified email spoof attempts on authenticated actions.
12. Guest checkout attempting to redeem points (`pointsRedeemed > 0`).
