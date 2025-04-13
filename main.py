import os
from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
from dotenv import load_dotenv
import traceback
import uuid

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Required for session

# Store chat sessions in memory (in a production app, you'd use a database)
chat_sessions = {}

def get_or_create_chat_session(session_id):
    """Get an existing chat session or create a new one."""
    if session_id not in chat_sessions:
        # Create a new chat session
        chat_sessions[session_id] = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [
                        "chatbot designed to help you find ways to save energy and reduce your electricity bills\n",
                    ],
                },
                {
                    "role": "model",
                    "parts": [
                        "Hello! I'm WattSaver, your personal energy efficiency assistant.  I can help you find ways to save energy and lower your electricity bill.  To best assist you, tell me a bit about your energy usage habits or concerns.  For example, you could tell me:\n\n* **What are your biggest energy consumers?** (e.g., heating/cooling, lighting, appliances)\n* **Are there any specific appliances or areas of your home you'd like to focus on?**\n* **What's your current energy bill like?** (You don't need to share the exact amount, just a general idea – high, average, low)\n* **What kind of home do you live in?** (e.g., apartment, house, size)\n* **Are you willing to make small changes, or are you looking for more significant upgrades?**\n\nThe more information you give me, the more tailored and helpful my suggestions will be.  Let's start saving energy!\n",
                    ],
                },
            ]
        )
    return chat_sessions[session_id]

@app.route('/')
def index():
    # Generate a unique session ID for this user
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Get the session ID from the Flask session
    session_id = session.get('session_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        session['session_id'] = session_id
    
    try:
        # Get the chat session for this user
        chat_session = get_or_create_chat_session(session_id)
        
        # Send message to Gemini and get response
        response = chat_session.send_message(user_message)
        return jsonify({'response': response.text})
    except Exception as e:
        # Print detailed error information for debugging
        error_details = traceback.format_exc()
        print(f"Error in chat endpoint: {str(e)}")
        print(f"Error details: {error_details}")
        
        # If there's an error with the chat session, try to recreate it
        if session_id in chat_sessions:
            del chat_sessions[session_id]
        
        try:
            # Try again with a new session
            chat_session = get_or_create_chat_session(session_id)
            response = chat_session.send_message(user_message)
            return jsonify({'response': response.text})
        except Exception as retry_error:
            print(f"Error after retry: {str(retry_error)}")
            return jsonify({'error': 'Failed to process your request. Please try again later.'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)