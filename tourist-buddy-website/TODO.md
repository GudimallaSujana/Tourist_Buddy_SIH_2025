# Fix ESLint Errors for Clean Run

## Steps:

- [x] 1. Fix src/lib/config.ts - remove `any` from import.meta.env accesses
- [ ] 2. Fix src/pages/Map.tsx - replace `any` with proper types/interfaces, fix leaflet casts
- [x] 3. Fix src/lib/blockchain.ts - wrap case blocks to fix no-case-declarations
- [ ] 4. Fix tailwind.config.ts - replace require with ESM import or disable rule
- [ ] 5. Fix src/components/FestivalCalendar.tsx - type `h: any` in map callback
- [ ] 6. Fix src/components/QRCodeScanner.tsx - type `onScan`, `scanResult`
- [ ] 7. Fix src/components/ui/command.tsx, textarea.tsx - empty interface
- [ ] 8. Suppress/add disables for react-refresh/exhaustive-deps warnings
- [ ] 9. Run `npm run lint` - verify 0 errors
- [ ] 10. Restart dev server `npm run dev` clean

Next step: config.ts
