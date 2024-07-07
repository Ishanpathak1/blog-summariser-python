document.getElementById('summarize').addEventListener('click', async () => {
    try {
      // Query for the active tab
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      // Execute a content script in the active tab to fetch article content
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: () => {
            const paragraphs = Array.from(document.querySelectorAll('p'))
                                    .map(p => p.textContent.trim())
                                    .filter(text => text.length > 0);
            return paragraphs.join('\n');
          },
        },
        async (results) => {
          if (results && results[0]) {
            const content = results[0].result;
  
            try {
              const response = await fetch('http://127.0.0.1:5000/summarize', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content })
              });
  
              if (!response.ok) {
                throw new Error('Failed to fetch data. Status: ' + response.status);
              }
  
              const data = await response.json();
              const summary = data.summary;
              document.getElementById('summary').innerText = summary;
            } catch (error) {
              console.error('Error fetching or processing data:', error.message);
            }
          } else {
            console.error('Failed to retrieve content from the page.');
          }
        }
      );
    } catch (error) {
      console.error('Error initializing summarization:', error.message);
    }
  });
  