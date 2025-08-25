# 🌐 Web App Opener with Timer

A simple web application that allows you to open any website in a new tab with an automatic timer-controlled close feature. Pre-configured for [mForex WebTrader](https://webtrader.mforex.pl/) with optimal timing settings.

## Features

- ✅ Open any website URL in a new browser popup window
- 🔐 Preserves browser autofill and saved passwords
- ⏰ Delay countdown before opening website (1-300 seconds)
- ⏲️ Auto-close timer after viewing period (1-3600 seconds)
- 📊 Real-time countdown display for both phases
- 🚫 Cancel timer functionality
- 📱 Responsive design that works on desktop and mobile
- 🎨 Modern, beautiful UI with glassmorphism effects

## How to Use

### Quick Start (Recommended)
1. **Open the App**: Open `index.html` in your web browser
2. **Click "Start Countdown"**: The app is pre-configured with optimal settings for mForex WebTrader
   - 5-second countdown before opening anything
   - URL: `https://webtrader.mforex.pl/` (opens after countdown)
   - Auto-close: 30 seconds viewing time
3. **Countdown Phase**: Beautiful countdown window shows 5→0 before opening mForex
4. **Saved Passwords Work**: Your browser's saved login credentials will autofill normally
5. **Enjoy**: Watch the countdown and automatic operation

### Custom Configuration
1. **Modify Values**: Change URL, delay (1-300s), or auto-close timer (1-3600s) as needed
2. **Launch**: Click "Quick Start" to begin the delay countdown
3. **Monitor**: Watch the countdown - first it delays opening, then auto-closes the window
4. **Cancel**: Optionally cancel early during either countdown phase

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Popup blocker disabled for this site (to allow opening new tabs)

## Browser Compatibility

This app uses modern web APIs and should work in:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- The app uses `window.open()` with security flags (`noopener`, `noreferrer`)
- Only HTTP/HTTPS URLs are accepted for security
- The app doesn't store any user data or URLs

## Technical Details

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS animations
- **JavaScript**: ES6 classes, modern DOM APIs
- **No dependencies**: Pure vanilla web technologies

## File Structure

```
├── index.html      # Main HTML file
├── style.css       # Styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This documentation
```

## License

This project is open source and available under the MIT License. 