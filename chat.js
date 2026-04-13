export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "OpenAI API Error",
        detail: text
      });
    }

    const data = JSON.parse(text);

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "no response"
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
