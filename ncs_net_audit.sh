```bash
#!/usr/bin/env bash
set -u

DOMAIN="naughtycamspot.com"
WWW="www.${DOMAIN}"
IP="185.235.176.134"
OUT="ncs_net_audit_$(date +%Y%m%d_%H%M%S).txt"

PATHS=(
  "/"
  "/startright/"
  "/earnings/"
  "/blog/"
  "/privacy/"
  "/terms/"
  "/disclosure/"
  "/claim/"
)

{
  echo "=== NCS Network Audit ==="
  echo "Timestamp: $(date -u) (UTC)"
  echo "Local: $(date)"
  echo "Host: $(hostname)"
  echo "macOS: $(sw_vers 2>/dev/null | tr '\n' ' ' || true)"
  echo
  echo "Domain: ${DOMAIN}"
  echo "WWW:    ${WWW}"
  echo "IP:     ${IP}"
  echo

  echo "=== DNS: NS / SOA ==="
  dig +short NS "${DOMAIN}" || true
  dig +short SOA "${DOMAIN}" || true
  echo

  echo "=== DNS: CNAME/A/AAAA ==="
  echo "-- ${WWW} CNAME"
  dig +short CNAME "${WWW}" || true
  echo "-- ${DOMAIN} A"
  dig +short A "${DOMAIN}" || true
  echo "-- ${WWW} A"
  dig +short A "${WWW}" || true
  echo "-- ${DOMAIN} AAAA"
  dig +short AAAA "${DOMAIN}" || true
  echo "-- ${WWW} AAAA"
  dig +short AAAA "${WWW}" || true
  echo

  echo "=== DNS: resolver config ==="
  scutil --dns 2>/dev/null | sed -n '1,200p' || true
  echo

  echo "=== HTTP headers: apex vs www (root) ==="
  echo "-- curl -I https://${DOMAIN}/"
  curl -sS -I "https://${DOMAIN}/" || true
  echo
  echo "-- curl -I https://${WWW}/"
  curl -sS -I "https://${WWW}/" || true
  echo
  echo "-- curl -IL https://${WWW}/  (follow redirects)"
  curl -sS -IL "https://${WWW}/" || true
  echo

  echo "=== HTTP headers: key paths (apex + www) ==="
  for p in "${PATHS[@]}"; do
    echo "--- PATH: ${p}"
    echo "-- apex: curl -sS -I https://${DOMAIN}${p}"
    curl -sS -I "https://${DOMAIN}${p}" || true
    echo
    echo "-- www:  curl -sS -I https://${WWW}${p}"
    curl -sS -I "https://${WWW}${p}" || true
    echo
  done

  echo "=== Forced host routing (same IP, different Host header) ==="
  echo "-- www forced to IP"
  curl -sS -I --resolve "${WWW}:443:${IP}" "https://${WWW}/" || true
  echo
  echo "-- apex forced to IP"
  curl -sS -I --resolve "${DOMAIN}:443:${IP}" "https://${DOMAIN}/" || true
  echo

  echo "=== TLS certificate (SANs) ==="
  echo "-- www cert"
  echo | openssl s_client -servername "${WWW}" -connect "${WWW}:443" 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName || true
  echo
  echo "-- apex cert"
  echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName || true
  echo

  echo "=== Connectivity ==="
  echo "-- ping (3) ${IP}"
  ping -c 3 "${IP}" 2>/dev/null || true
  echo
  echo "-- traceroute (max 12 hops) ${IP}"
  traceroute -m 12 "${IP}" 2>/dev/null || true
  echo

  echo "=== End ==="
} > "${OUT}"

echo "Saved: ${OUT}"
echo "Attach/drop that file here for analysis."
```

