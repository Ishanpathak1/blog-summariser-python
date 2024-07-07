from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

HUGGING_FACE_API_KEY = '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'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    content = request.json.get('content')
    response = requests.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        headers={
            'Authorization': f'Bearer {HUGGING_FACE_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={'inputs': content}
    )

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from Hugging Face API', 'status_code': response.status_code}), 500

    data = response.json()
    summary = data[0].get('summary_text', 'No summary available')

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
