# URL Scanner

URL Scanner is a simple web application that checks the safety of URLs using the VirusTotal API. It stores the results in a MongoDB database to avoid redundant checks for the same URL.

## Prerequisites

- Node.js installed
- MongoDB database
- VirusTotal API key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/url-scanner.git
   ```
2. Install dependencies:

   ```bash
   cd url-scanner
   npm install
   ```

3. Set up environment variables:

   Change MongoDB connection String & VirusTool API key in `app.js`

   ```bash
   MONGODB_URI=<Your MongoDB connection URI>
   VIRUSTOTAL_API_KEY=<Your VirusTotal API key>
   ```
4. Run the application:
   ```bash
   node .
   ```

## Usage

- Open the web application in your browser.
- Enter a URL in the input field and click the "Check URL" button.
- View the results on the page.

## Features

- Checks the safety of URLs using VirusTotal API.
- Stores results in a MongoDB database.
- Avoids redundant checks for the same URL.
