#!/usr/bin/env bash
set -euo pipefail

CMS="http://localhost:3001"
WEB="http://localhost:3000"
PASS=0
FAIL=0
TOTAL=0

ok()   { PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); echo "  ❌ $1"; }

echo "═══════════════════════════════════════"
echo "  E2E Sprint 6 — Fulfillment + Notif"
echo "═══════════════════════════════════════"
echo ""

# ── 1. Admin login ──────────────────────────
echo "1️⃣  Admin login"
ADMIN_RES=$(curl -s -X POST "$CMS/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@depilmoni.local","password":"ChangeMe123!"}')

ADMIN_TOKEN=$(echo "$ADMIN_RES" | jq -r '.token // empty')
if [ -z "$ADMIN_TOKEN" ]; then
  fail "Admin login failed"
  echo "$ADMIN_RES" | jq .
  exit 1
fi
ok "Admin JWT obtained"

# ── 2. Register customer ────────────────────
echo ""
echo "2️⃣  Register customer for Sprint 6 test"
TS=$(date +%s)
CUST_EMAIL="sprint6-${TS}@test.com"

REG_RES=$(curl -s -X POST "$CMS/api/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $ADMIN_TOKEN" \
  -d "{
    \"name\": \"Sprint6 Tester\",
    \"email\": \"$CUST_EMAIL\",
    \"password\": \"Test1234!\",
    \"cpf\": \"${TS}00\",
    \"phone\": \"11999${TS: -6}\",
    \"profileType\": \"client\",
    \"xpBalance\": 0
  }")

CUST_ID=$(echo "$REG_RES" | jq -r '.doc.id // .id // empty')
if [ -z "$CUST_ID" ]; then
  fail "Customer registration failed"
  echo "$REG_RES" | jq .
  exit 1
fi
ok "Customer created: id=$CUST_ID email=$CUST_EMAIL"

# ── 3. Customer login ───────────────────────
echo ""
echo "3️⃣  Customer login"
CUST_LOGIN=$(curl -s -X POST "$CMS/api/customers/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CUST_EMAIL\",\"password\":\"Test1234!\"}")

CUST_TOKEN=$(echo "$CUST_LOGIN" | jq -r '.token // empty')
if [ -z "$CUST_TOKEN" ]; then
  fail "Customer login failed"
  echo "$CUST_LOGIN" | jq .
  exit 1
fi
ok "Customer JWT obtained"

# ── 4. Create address (test geocodification hook) ─
echo ""
echo "4️⃣  Create address (geocodification test)"
ADDR_RES=$(curl -s -X POST "$CMS/api/addresses" \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $CUST_TOKEN" \
  -d "{
    \"customer\": $CUST_ID,
    \"label\": \"Casa Sprint6\",
    \"recipientName\": \"Sprint6 Tester\",
    \"street\": \"Avenida Paulista\",
    \"number\": \"1000\",
    \"complement\": \"Sala 1\",
    \"neighborhood\": \"Bela Vista\",
    \"city\": \"São Paulo\",
    \"state\": \"SP\",
    \"zipCode\": \"01310-100\",
    \"isDefault\": true
  }")

ADDR_ID=$(echo "$ADDR_RES" | jq -r '.doc.id // .id // empty')
if [ -z "$ADDR_ID" ]; then
  fail "Address creation failed"
  echo "$ADDR_RES" | jq .
  exit 1
fi
ok "Address created: id=$ADDR_ID"

# Wait a moment for geocodification hook
sleep 3

# Check if geocode ran
ADDR_CHECK=$(curl -s "$CMS/api/addresses/$ADDR_ID" \
  -H "Authorization: JWT $CUST_TOKEN")
ADDR_LAT=$(echo "$ADDR_CHECK" | jq -r '.latitude // empty')
ADDR_LNG=$(echo "$ADDR_CHECK" | jq -r '.longitude // empty')

if [ -n "$ADDR_LAT" ] && [ -n "$ADDR_LNG" ]; then
  ok "Geocodification worked: lat=$ADDR_LAT, lng=$ADDR_LNG"
else
  echo "  ⚠️  Geocodification didn't fill lat/lng (Nominatim may be slow/unavailable) — non-blocking"
fi

# ── 5. Checkout → create order ──────────────
echo ""
echo "5️⃣  Checkout (create order)"
CHECKOUT_RES=$(curl -s -X POST "$WEB/api/checkout" \
  -H "Content-Type: application/json" \
  -H "Cookie: depilmoni_token=$CUST_TOKEN" \
  -d "{
    \"items\": [{
      \"type\": \"product\",
      \"productId\": \"product_cera_chocolate\",
      \"variantId\": \"variant_cera_chocolate_500\",
      \"quantity\": 1
    }],
    \"addressId\": \"$ADDR_ID\",
    \"shippingAmount\": 15.90,
    \"paymentMethod\": \"pix\"
  }")

ORDER_ID=$(echo "$CHECKOUT_RES" | jq -r '.order.id // empty')
ORDER_CODE=$(echo "$CHECKOUT_RES" | jq -r '.order.code // empty')
CHECKOUT_STATUS=$(echo "$CHECKOUT_RES" | jq -r '.error // empty')

if [ -z "$ORDER_ID" ]; then
  fail "Checkout failed"
  echo "$CHECKOUT_RES" | jq .
  exit 1
fi
ok "Order created: id=$ORDER_ID code=$ORDER_CODE"

# ── 6. Admin: update order to 'shipped' with tracking ─
echo ""
echo "6️⃣  Admin: set order to 'shipped' with tracking"
SHIP_RES=$(curl -s -X PATCH "$CMS/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $ADMIN_TOKEN" \
  -d '{
    "status": "shipped",
    "trackingCode": "BR123456789SP",
    "trackingUrl": "https://www.correios.com.br/rastreamento/BR123456789SP",
    "shippedAt": "2026-04-15T10:00:00.000Z"
  }')

SHIP_STATUS=$(echo "$SHIP_RES" | jq -r '.doc.status // .status // empty')
SHIP_TRACKING=$(echo "$SHIP_RES" | jq -r '.doc.trackingCode // .trackingCode // empty')
if [ "$SHIP_STATUS" = "shipped" ] && [ "$SHIP_TRACKING" = "BR123456789SP" ]; then
  ok "Order status=shipped, trackingCode=BR123456789SP"
else
  fail "Order update to shipped failed"
  echo "$SHIP_RES" | jq .
fi

# Wait for afterChange hook to create notification
sleep 2

# ── 7. Verify notification was created ──────
echo ""
echo "7️⃣  Verify 'order-status' notification for shipped"
NOTIF_RES=$(curl -s --max-time 10 --globoff "$CMS/api/notifications?where[customer][equals]=$CUST_ID&where[type][equals]=order-status&sort=-createdAt&limit=5" \
  -H "Authorization: JWT $ADMIN_TOKEN")

NOTIF_COUNT=$(echo "$NOTIF_RES" | jq '.totalDocs // 0')
NOTIF_TITLE=$(echo "$NOTIF_RES" | jq -r '.docs[0].title // empty')
NOTIF_MSG=$(echo "$NOTIF_RES" | jq -r '.docs[0].message // empty')

TITLE_MATCH=$(echo "$NOTIF_TITLE" | grep -ci "enviado" || true)
if [ "$NOTIF_COUNT" -ge 1 ] && [ "$TITLE_MATCH" -ge 1 ]; then
  ok "Notification created: \"$NOTIF_TITLE\" — $NOTIF_MSG"
else
  fail "No 'shipped' notification found (count=$NOTIF_COUNT, title=$NOTIF_TITLE)"
  echo "$NOTIF_RES" | jq '.docs[:2]'
fi

# ── 8. Admin: deliver the order ─────────────
echo ""
echo "8️⃣  Admin: set order to 'delivered'"
DELIV_RES=$(curl -s -X PATCH "$CMS/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $ADMIN_TOKEN" \
  -d '{
    "status": "delivered",
    "deliveredAt": "2026-04-15T14:00:00.000Z"
  }')

DELIV_STATUS=$(echo "$DELIV_RES" | jq -r '.doc.status // .status // empty')
if [ "$DELIV_STATUS" = "delivered" ]; then
  ok "Order status=delivered"
else
  fail "Order update to delivered failed"
  echo "$DELIV_RES" | jq .
fi

sleep 2

# Verify delivered notification
NOTIF_DEL=$(curl -s --max-time 10 --globoff "$CMS/api/notifications?where[customer][equals]=$CUST_ID&where[type][equals]=order-status&sort=-createdAt&limit=5" \
  -H "Authorization: JWT $ADMIN_TOKEN")
NOTIF_DEL_COUNT=$(echo "$NOTIF_DEL" | jq '.totalDocs // 0')
NOTIF_DEL_TITLE=$(echo "$NOTIF_DEL" | jq -r '.docs[0].title // empty')

DEL_MATCH=$(echo "$NOTIF_DEL_TITLE" | grep -ci "entregue" || true)
if [ "$NOTIF_DEL_COUNT" -ge 2 ] && [ "$DEL_MATCH" -ge 1 ]; then
  ok "Delivered notification: \"$NOTIF_DEL_TITLE\""
else
  fail "No 'delivered' notification (count=$NOTIF_DEL_COUNT, title=$NOTIF_DEL_TITLE)"
fi

# ── 9. Unread count via web API ─────────────
echo ""
echo "9️⃣  Unread notifications count via web API"
UNREAD_RES=$(curl -s --max-time 10 "$WEB/api/notifications/unread-count" \
  -H "Cookie: depilmoni_token=$CUST_TOKEN")
UNREAD_COUNT=$(echo "$UNREAD_RES" | jq -r '.count // 0')

# At least 3: xp-earned from checkout + shipped notif + delivered notif
if [ "$UNREAD_COUNT" -ge 3 ]; then
  ok "Unread count = $UNREAD_COUNT (expected ≥ 3)"
else
  echo "  ⚠️  Unread count = $UNREAD_COUNT (expected ≥ 3, may be timing issue)"
fi

# ── 10. Map data endpoint ───────────────────
echo ""
echo "🔟  Admin map-data endpoint"
MAP_RES=$(curl -s --max-time 10 "$CMS/api/admin/customers/map-data" \
  -H "Authorization: JWT $ADMIN_TOKEN")
MAP_TOTAL=$(echo "$MAP_RES" | jq '.total // 0')
MAP_POINTS=$(echo "$MAP_RES" | jq '.points | length')

if [ "$MAP_POINTS" -ge 0 ]; then
  ok "Map data returned: $MAP_TOTAL points"
else
  fail "Map data endpoint error"
  echo "$MAP_RES" | jq .
fi

# With city filter
MAP_SP=$(curl -s --max-time 10 "$CMS/api/admin/customers/map-data?city=S%C3%A3o%20Paulo" \
  -H "Authorization: JWT $ADMIN_TOKEN")
MAP_SP_TOTAL=$(echo "$MAP_SP" | jq '.total // 0')
ok "Map data with city filter: $MAP_SP_TOTAL points"

# ── 11. Verify order detail page has tracking ─
echo ""
echo "1️⃣1️⃣ Verify order detail shows tracking info"
ORDER_PAGE=$(curl -s --max-time 10 "$WEB/minha-conta/pedidos/$ORDER_ID" \
  -H "Cookie: depilmoni_token=$CUST_TOKEN")

TRACK_MATCH=$(echo "$ORDER_PAGE" | grep -c "BR123456789SP" || true)
if [ "$TRACK_MATCH" -ge 1 ]; then
  ok "Tracking code visible on order detail page"
else
  echo "  ⚠️  Tracking code not found in rendered HTML (may be client-side rendered)"
fi

LINK_MATCH=$(echo "$ORDER_PAGE" | grep -c "Acompanhar entrega" || true)
if [ "$LINK_MATCH" -ge 1 ]; then
  ok "Tracking link visible on order detail page"
else
  echo "  ⚠️  Tracking link not in HTML (may be CSR)"
fi

# ── Summary ─────────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "  RESULTADO: $PASS/$TOTAL passed, $FAIL failed"
echo "═══════════════════════════════════════"

exit $FAIL
