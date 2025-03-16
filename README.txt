# ChatGPT Water Usage Tracker

## Overview
This script is a ChatGPT Water Usage Tracker, which estimates the water footprint of each prompt typed into ChatGPT. It logs daily water usage and allows users to retrieve historical water consumption data. The script also includes a button to view the log directly.

## Features
- 📊 Estimates Water Usage for every prompt typed.
- 💾 Logs Water Consumption by date in `localStorage`.
- 🔍 Retrieves Historical Water Usage with a simple button click.
- 📢 Provides a Tracker UI that updates dynamically.

## Installation (Developer Mode - Chrome Extension)
To use this script as a developer extension in Google Chrome, follow these steps:

### Step 1: Clone or Download the Repository
1. Open a terminal and navigate to your desired directory.
2. Clone the repository:
   
   git clone https://github.com/YOUR_GITHUB_USERNAME/chatgpt-water-tracker.git
   
3. Navigate into the project folder:

   cd chatgpt-water-tracker
   
### Step 2: Load the Extension in Chrome
1. Open Google Chrome.
2. Go to `chrome://extensions/`.
3. Enable Developer Mode (toggle in the top-right corner).
4. Click **"Load unpacked" and select the project folder.
5. The ChatGPT Water Usage Tracker should now be active!

## How to Use
- As you type into ChatGPT, the tracker will display an estimated water usage per prompt.
- A button will appear below the input box—click it to view your historical usage logs.
- The tracker resets automatically after 5 seconds of inactivity, logging your water usage for that session.

## Future Enhancements
- ✅ Option to export logs to a CSV file.
- ✅ Ability to sync logs across devices.
- ✅ Improved UI and customization options.

## Contributing
Feel free to fork the repository, submit pull requests, or open issues for feature requests and bug reports.

## License
This project is licensed under the MIT License.


