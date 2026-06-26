import numpy as np
from PIL import Image
from scipy import ndimage

SRC = r"C:\Users\laiha\Downloads\ChatGPT Image Jun 25, 2026, 08_11_09 PM.png"
DST = r"C:\Users\laiha\Downloads\claude_coding2026\de-hawkers-liverpool\public\brand\de-hawkers-cart-logo-red.png"

im = Image.open(SRC).convert("RGB")
arr = np.array(im).astype(np.int16)
h, w, _ = arr.shape

r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
grayish_light = (
    (np.abs(r - g) < 8) & (np.abs(g - b) < 8) & (np.abs(r - b) < 8) & (np.minimum(np.minimum(r, g), b) > 220)
)

labels, n = ndimage.label(grayish_light, structure=np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]]))
border_labels = set(labels[0, :].tolist()) | set(labels[-1, :].tolist()) | set(labels[:, 0].tolist()) | set(labels[:, -1].tolist())
border_labels.discard(0)

bg_mask = np.isin(labels, list(border_labels))
# dilate the background mask by 1px to eat the anti-aliased checkerboard fringe
bg_mask = ndimage.binary_dilation(bg_mask, iterations=1)

alpha = np.where(bg_mask, 0, 255).astype(np.uint8)

rgba = np.dstack([np.array(im), alpha])
out = Image.fromarray(rgba, mode="RGBA")

# crop to opaque content bounding box with padding
ys, xs = np.where(alpha > 0)
pad = 12
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, w)
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, h)
out = out.crop((x0, y0, x1, y1))

out.save(DST)
print("saved", DST, out.size)
