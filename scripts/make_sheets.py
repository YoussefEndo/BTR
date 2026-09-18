"""Build numbered contact sheets from the WhatsApp product photos."""
import os
from PIL import Image

SRC = r"pic/WhatsApp Unknown 2026-09-12 at 23.51.04"
OUT = "pic/_sheets"
os.makedirs(OUT, exist_ok=True)

# Keep WhatsApp's chronological order.
files = sorted(
    f for f in os.listdir(SRC)
    if f.lower().endswith((".jpeg", ".jpg", ".png", ".webp"))
)
print(f"{len(files)} images")

COLS, ROWS = 4, 4  # 16 per sheet
THUMB_W = 320
THUMB_H = 320
LABEL_H = 28

sheet_idx = 0
for start in range(0, len(files), COLS * ROWS):
    batch = files[start:start + COLS * ROWS]
    rows = (len(batch) + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * THUMB_W, rows * (THUMB_H + LABEL_H)), "white")
    from PIL import ImageDraw
    draw = ImageDraw.Draw(sheet)
    for i, fname in enumerate(batch):
        col, row = i % COLS, i // COLS
        try:
            im = Image.open(os.path.join(SRC, fname)).convert("RGB")
            im.thumbnail((THUMB_W, THUMB_H))
            x = col * THUMB_W + (THUMB_W - im.width) // 2
            y = row * (THUMB_H + LABEL_H) + (THUMB_H - im.height) // 2
            sheet.paste(im, (x, y))
        except Exception as e:
            print(f"skip {fname}: {e}")
        label = f"#{start + i + 1}"
        draw.text(
            (col * THUMB_W + 8, row * (THUMB_H + LABEL_H) + THUMB_H + 6),
            label, fill="black",
        )
    sheet_idx += 1
    out = os.path.join(OUT, f"sheet-{sheet_idx:02d}.png")
    sheet.save(out)
    print(out, len(batch), "images")
