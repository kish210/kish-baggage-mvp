# kish-baggage-mvp

MVP for **Kish airport → hotel room baggage handling** with **Zebra (ZPL)** printing.

## What’s inside
- `server/` Node.js API that generates a **TRACK-ID** and returns **ZPL** (IATA-style single-strip tag)
- `kiosk-ui/` simple kiosk HTML page to request ZPL

## Run
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Open `kiosk-ui/index.html` and set:
- Server URL: `http://localhost:8080`
- API Key: same as `.env` (`API_KEY`)

## API
`POST /api/print` with JSON:
```json
{
  "hotelName": "PALACE HOTEL",
  "displayName": "SEYED ALI MOUSAVI",
  "bagsTotal": 3,
  "bagIndex": 1,
  "dpi": 203,
  "from": "KIH"
}
```

Returns `{ trackId, zpl, dpi }`.

## Zebra printing (network)
Send the ZPL to the printer port **9100** (RAW). Example Node:
```js
import net from "net";
const client = new net.Socket();
client.connect(9100, "PRINTER_IP", () => {
  client.write(zpl);
  client.end();
});
```

## Notes
- QR is generated with `^BQN` and includes full payload.
- Barcode is Code128 and contains only TRACK-ID.
