# Watermarking Paid Library PDFs

Watermark string (exact):

`Licensed to [Telegram/email] – Do not redistribute`

## Goal

Apply a visible footer watermark to Paid Library PDFs as a deterrent against redistribution.

Acceptance:
- Watermark is visible on every page (preferred) or at minimum the first page.

## Manual Workflow (Phase 1)

1. Open the PDF in a PDF editor.
2. Add the footer text:
   - Text: `Licensed to [Telegram/email] – Do not redistribute`
   - Placement: footer, centered or bottom-right.
   - Style: small but readable, light gray.
3. Apply the watermark onto all pages if supported.
4. Export the PDF.
5. Verify the watermark renders in a standard PDF viewer.

## Notes

- Keep the watermark in the content layer (not just viewer-only overlays).
- Do not commit customer PII. Use the placeholder during generation and stamp per-customer at delivery time.
