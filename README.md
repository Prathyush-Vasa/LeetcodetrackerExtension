# LeetCode Weekly Tracker Extension

A Chrome browser extension to track your daily LeetCode problem-solving progress with a weekly goal of 50 problems.

## Features

- **Weekly Progress Tracking**: Track problems solved from Monday to Sunday
- **Visual Progress Bar**: See your progress toward the 50-problem weekly goal
- **Daily Counters**: Add/subtract problems for each day with + and - buttons
- **Auto-reset**: Automatically resets progress at the start of each new week
- **Auto-detection**: Attempts to detect solved problems from LeetCode pages
- **Persistent Storage**: Your progress is saved locally and persists between browser sessions
- **Modern UI**: Clean, responsive design with smooth animations

## Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right
4. **Click "Load unpacked"** and select the folder containing this extension
5. **Pin the extension** to your toolbar for easy access

### Method 2: Create Icons (Required)

Before loading the extension, you need to create actual PNG icon files:

- Replace `icons/icon16.png` with a 16x16 pixel PNG icon
- Replace `icons/icon48.png` with a 48x48 pixel PNG icon  
- Replace `icons/icon128.png` with a 128x128 pixel PNG icon

You can create simple icons using:
- Online icon generators (like favicon.io)
- Image editing software (GIMP, Photoshop, etc.)
- AI image generators with appropriate prompts

## Usage

### Basic Tracking

1. **Click the extension icon** in your Chrome toolbar
2. **Use + and - buttons** to adjust problem counts for each day
3. **Monitor your progress** with the visual progress bar
4. **Reset the week** if needed using the reset button

### Auto-detection

1. **Navigate to LeetCode** (leetcode.com)
2. **Click the extension icon**
3. **Click "Auto-detect from LeetCode"**
4. The extension will attempt to detect your solved problems

**Note**: Auto-detection works best when you're on:
- Problem pages with submission status
- Profile/submissions pages
- Recent submissions lists

### Weekly Reset

- Progress automatically resets every Monday
- You can manually reset anytime using the reset button
- Data is stored locally in your browser

## File Structure

```
LeetcodeExtension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Content script for LeetCode pages
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md             # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `storage`: Save progress locally
  - `activeTab`: Access current tab for auto-detection
- **Content Scripts**: Run on LeetCode pages for problem detection
- **Background Script**: Service worker for data management
- **Storage**: Chrome local storage API for persistence

## Customization

### Changing the Weekly Goal

To change from 50 problems to a different number:

1. Edit `popup.html` - change "Weekly Goal: 50 Problems"
2. Edit `popup.js` - update the calculation in `updateDisplay()` method
3. Edit `background.js` - update the default week data if needed

### Styling Changes

Modify `popup.css` to change colors, fonts, or layout:
- Change the gradient background
- Adjust button colors and hover effects
- Modify the progress bar appearance
- Update spacing and typography

## Troubleshooting

### Extension Won't Load

- Ensure all files are present and properly named
- Check that icons are actual PNG files (not text files)
- Verify manifest.json syntax is correct
- Try refreshing the extensions page

### Auto-detection Not Working

- Make sure you're on a LeetCode page
- Try refreshing the page and clicking auto-detect again
- Check the browser console for error messages
- Auto-detection is experimental and may not work on all LeetCode pages

### Data Not Persisting

- Check that storage permission is granted
- Try disabling and re-enabling the extension
- Clear browser data and reload the extension

## Development

### Making Changes

1. **Edit the source files** as needed
2. **Reload the extension** in `chrome://extensions/`
3. **Test your changes** by clicking the extension icon

### Debugging

- Use Chrome DevTools on the popup (right-click extension icon → Inspect)
- Check the background script console in `chrome://extensions/`
- Monitor content script logs in the page console

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this extension!

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure you're using a supported Chrome version
4. Try reinstalling the extension

---

**Happy Coding! 🚀**

Track your LeetCode progress and reach your weekly goals with this simple, effective extension. 