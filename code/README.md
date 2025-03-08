# Minify Code App

This is a simple web app that allows you to minify HTML, CSS, and JavaScript code. The app provides functionality to:

- Minify HTML, CSS, and JS code.
- View the minified code and compare the sizes before and after minification.
- Copy minified code to the clipboard.
- Download the minified code with a custom file name.

## Features

- **Minify HTML:** Minifies HTML code by removing extra spaces, line breaks, and unnecessary characters.
- **Minify CSS:** Minifies CSS code by removing comments, extra spaces, and unnecessary spaces around brackets, colons, and semicolons.
- **Minify JS:** Minifies JavaScript code by removing comments, extra spaces, and unnecessary spaces around operators and delimiters.
- **View Switcher:** Switch between views (HTML, CSS, JS) using the corresponding buttons.
- **Copy to Clipboard:** Copy the minified code to the clipboard with the press of a button.
- **Download Minified Files:** Download the minified code as a file with a custom name.
  
## How It Works

1. The app has three views: HTML, CSS, and JS. You can switch between them using the buttons at the top.
2. Paste the code into the respective input fields for HTML, CSS, or JavaScript.
3. Click the "Minify" button to minify the code.
4. The minified code will appear in the output area along with the original size, minified size, and compression ratio.
5. You can copy the minified code to your clipboard or download it with a custom file name.

## How to Use

1. **Minifying HTML:**
   - Paste your HTML code in the HTML input box.
   - Click on the "Minify" button.
   - The minified HTML code will appear in the output box.

2. **Minifying CSS:**
   - Paste your CSS code in the CSS input box.
   - Click on the "Minify" button.
   - The minified CSS code will appear in the output box.

3. **Minifying JS:**
   - Paste your JavaScript code in the JS input box.
   - Click on the "Minify" button.
   - The minified JS code will appear in the output box.

4. **Copy to Clipboard:**
   - After minifying the code, click the "Copy" button to copy the minified code to your clipboard.

5. **Download Minified Code:**
   - Click on the "Download" button to download the minified code as a file with a custom name.

## Code Explanation

- `showView(view)`: Controls which view (HTML, CSS, JS) is displayed based on the button clicked.
- `minifyHtml()`, `minifyCSS()`, `minifyJS()`: Functions that handle the minification of the respective code types.
- `updateStats(type, original, minified)`: Updates the UI with the original size, minified size, and compression ratio.
- `copyToClipboard(type)`: Copies the minified code to the clipboard.
- `showMessage()`: Displays a success message when the code is copied.
- `openRenameDialog(type)`: Opens a dialog to rename the file before downloading.
- `downloadWithName()`: Downloads the minified code as a file with a custom name.

## Installation

To use this app, simply clone this repository to your local machine and open the HTML file in your browser.