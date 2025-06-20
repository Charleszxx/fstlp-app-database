import fetch from 'node-fetch'; // Only needed if you're using Node.js < 18

export default async function getQuoteHandler(req, res) {
  try {
    const response = await fetch('https://api.quotable.io/quotes/random');
    const data = await response.json();
    res.json(data[0]); // Send the first quote object
  } catch (err) {
    console.error('Error fetching quote:', err);
    // Fallback quote
    res.status(500).json({
      content: "Keep pushing forward, even when it's tough.",
      author: "Unknown"
    });
  }
}
