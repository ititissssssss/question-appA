export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
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

    // 👇ここ重要（ログ）
    console.log("OpenAI response:", text);

    if (!response.ok) {
      return res.status(500).json({ error: text });
    }

    const data = JSON.parse(text);

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
