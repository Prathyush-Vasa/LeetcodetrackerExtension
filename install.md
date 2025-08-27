# Quick Installation Guide

## Prerequisites
- Google Chrome browser
- Basic knowledge of browser extensions

## Step-by-Step Installation

### 1. Create Icons (IMPORTANT!)
Before installing, you must create actual PNG icon files:

**Option A: Use an online icon generator**
- Go to [favicon.io](https://favicon.io/) or similar
- Create a simple icon (can be text like "LC" or a code symbol)
- Download and rename to match the required sizes

**Option B: Use a simple image**
- Find any small image (16x16, 48x48, 128x128 pixels)
- Save as PNG format
- Replace the placeholder files in the `icons/` folder

### 2. Load the Extension

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer Mode** (toggle switch in top right)
3. **Click "Load unpacked"**
4. **Select the LeetcodeExtension folder**
5. **Pin the extension** to your toolbar

### 3. Test the Extension

1. **Click the extension icon** in your toolbar
2. **Try adding/subtracting problems** for different days
3. **Check that progress saves** between sessions
4. **Test the reset functionality**

## Troubleshooting

**Extension won't load?**
- Make sure you have actual PNG icon files (not text files)
- Check that all files are present in the folder
- Try refreshing the extensions page

**Icons not showing?**
- Icons must be actual PNG files, not text files
- Use an image editor or online generator to create them
- Ensure file names match exactly: `icon16.png`, `icon48.png`, `icon128.png`

**Need help?**
- Check the full README.md for detailed information
- Review browser console for error messages
- Ensure Chrome is up to date

## Success!
Once loaded, you'll see the extension icon in your toolbar. Click it to start tracking your LeetCode progress!

---

**Note**: This extension stores all data locally in your browser. Your progress will be saved between sessions but will reset each week automatically. 