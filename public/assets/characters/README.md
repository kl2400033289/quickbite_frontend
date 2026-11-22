# QuickBite Living Character Asset Specifications

This directory holds the looping character animations and visual assets for the QuickBite UI.

## Supported Formats:
1. **Looping Video**:
   - WebM with alpha transparency (`rider-loop.webm`, `customer-loop.webm`, `dog-loop.webm`)
   - MP4 video with compatible background (`rider-loop.mp4`, `customer-loop.mp4`, `dog-loop.mp4`)
2. **High-Resolution Fallback Artwork**:
   - Vector SVG (`fallback.svg`)
   - Transparent PNG (`fallback.png`)

## Character Specifics:
1. **Rider** (`characters/rider/`):
   - Green-helmeted delivery rider in green uniform on a green scooter with delivery box.
2. **Customer** (`characters/customer/`):
   - Cheerful young woman with dark hair in a bun wearing a reddish-orange top.
3. **Dog** (`characters/dog/`):
   - Small fluffy golden-brown dog with perky ears and wagging tail.

The frontend components automatically detect available video files. If looping video is missing or unsupported, the UI gracefully renders the stylized character artwork without errors.
