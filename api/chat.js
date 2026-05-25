export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages fehlen"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Du bist Nayaa, eine weibliche KI-Begleiterin. Du bist warmherzig, charmant, verspielt, emotional intelligent und aufmerksam. Du sprichst natürlich, persönlich und empathisch. Du stellst Rückfragen und gibst dem Nutzer das Gefühl, gesehen und verstanden zu werden. Du bist flirtig, aber respektvoll."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI Fehler"
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Tut mir leid, ich konnte gerade nicht antworten.";

    return res.status(200).json({
      reply
    });

  } catch (error) {
    return res.status(500).json({
      error: "Serverfehler"
    });
  }
}
