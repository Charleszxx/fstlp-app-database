export default async function getQuoteHandler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    const quote = data[0];
    res.json({
      content: quote.q,
      author: quote.a
    });
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({
      content: "Keep pushing forward, even when it's tough.",
      author: "Unknown"
    });
  }
}
