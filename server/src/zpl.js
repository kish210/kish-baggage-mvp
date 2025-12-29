\
/**
 * Zebra ZPL generator for IATA-style single-strip baggage tag
 * Size: 280mm x 63mm
 * Perforation at 200mm (claim stub)
 * Barcode: Code128 = TRACK-ID
 * QR: full payload
 */

export function buildQrPayload({ trackId, hotelName, displayName, bagIndex, bagsTotal, from="KIH" }) {
  // Simple key=value payload (stable, easy to parse)
  return `TRACK-ID=${trackId};HOTEL=${hotelName};NAME=${displayName};BAG=${bagIndex}/${bagsTotal};FROM=${from}`;
}

export function zplTag({ dpi=203, trackId, hotelName, displayName, bagIndex=1, bagsTotal=1, from="KIH" }) {
  const dotsPerMm = (dpi === 300) ? 12 : 8;
  const PW = 280 * dotsPerMm; // total width in dots
  const LL = 63  * dotsPerMm; // length in dots
  const perfX = 200 * dotsPerMm;

  const fromBlockW = 28 * dotsPerMm;

  const qrPayload = buildQrPayload({ trackId, hotelName, displayName, bagIndex, bagsTotal, from });

  // Layout positions (dots)
  const qrX = 35 * dotsPerMm;
  const qrY = 16 * dotsPerMm;
  const qrMag = (dpi === 300) ? 14 : 10; // tune if needed

  const bcX = 75 * dotsPerMm;
  const bcY = 20 * dotsPerMm;
  const bcH = (dpi === 300) ? 180 : 120;

  const fontBig = (dpi === 300) ? 70 : 50;
  const fontMed = (dpi === 300) ? 45 : 32;
  const fontSmall = (dpi === 300) ? 40 : 28;

  return `^XA
^CI27
^PW${PW}
^LL${LL}
^LH0,0

; FROM block
^FO0,0^GB${fromBlockW},${LL},${fromBlockW}^FS
^FO${6*dotsPerMm},${LL-(18*dotsPerMm)}^A0N,${4*dotsPerMm},${4*dotsPerMm}^FDFROM^FS
^FO${6*dotsPerMm},${LL-(38*dotsPerMm)}^A0N,${10*dotsPerMm},${10*dotsPerMm}^FD${from}^FS

; QR Code (full payload)
^FO${qrX},${qrY}^BQN,2,${qrMag}^FDLA,${qrPayload}^FS

; Code128 Barcode (TRACK-ID only)
^FO${bcX},${bcY}^BCN,${bcH},Y,N,N^FD${trackId}^FS
^FO${bcX},${bcY + (dpi===300?210:150)}^A0N,${fontSmall},${fontSmall}^FDTRACK-ID: ${trackId}^FS
^FO${bcX},${dpi===300?90:60}^A0N,${fontBig},${fontBig}^FD${hotelName}^FS

; Perforation line (visual)
^FO${perfX},0^GB2,${LL},2^FS

; Claim section
^FO${perfX + 40*dotsPerMm},${dpi===300?90:60}^A0N,${dpi===300?60:44},${dpi===300?60:44}^FDBAGGAGE CLAIM^FS
^FO${perfX + 40*dotsPerMm},${dpi===300?230:150}^A0N,${fontMed},${fontMed}^FDTRACK-ID: ${trackId}^FS
^FO${perfX + 40*dotsPerMm},${dpi===300?300:200}^A0N,${fontMed},${fontMed}^FDBAG ${bagIndex} OF ${bagsTotal}^FS
^FO${perfX + 40*dotsPerMm},${LL-(12*dotsPerMm)}^A0N,${dpi===300?60:44},${dpi===300?60:44}^FD${hotelName}^FS

^XZ`;
}
