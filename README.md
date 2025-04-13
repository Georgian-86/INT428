# WattSaver - Energy Efficiency Assistant

A modern web application that uses Google's Gemini AI to provide personalized energy-saving advice and help users reduce their electricity bills.

## Features

- Interactive chat interface with a modern, responsive design
- Powered by Google's Gemini AI for intelligent energy-saving recommendations
- Real-time responses to user queries about energy efficiency
- Markdown formatting support for better readability

## Prerequisites

- Python 3.7 or higher
- Google Gemini API key

## Installation

### Option 1: Using the setup scripts (Recommended)

#### Windows
1. Double-click the `run.bat` file to automatically:
   - Create a virtual environment
   - Install all dependencies
   - Start the application

#### macOS/Linux
1. Make the run script executable:
   ```
   chmod +x run.sh
   ```
2. Run the script:
   ```
   ./run.sh
   ```

### Option 2: Manual setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create a virtual environment:
   ```
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

1. Start the Flask application:
   ```
   python main.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

3. Start chatting with the WattSaver assistant to get personalized energy-saving advice!

## Project Structure

```
├── main.py              # Flask application and Gemini AI integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (API keys)
├── setup.py             # Python script to set up virtual environment
├── run.bat              # Windows batch file for easy setup and run
├── run.sh               # Shell script for macOS/Linux users
├── templates/           # HTML templates
│   └── index.html       # Main chat interface
└── static/              # Static assets
    ├── css/             # CSS stylesheets
    │   └── style.css    # Main stylesheet
    └── js/              # JavaScript files
        └── script.js    # Chat functionality
```

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Google Gemini API
- **Styling**: Custom CSS with modern design principles

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the intelligent chatbot capabilities
- Font Awesome for the icons
- Google Fonts for the Poppins font family 