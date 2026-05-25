let conversationHistory = [];

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body;

    conversationHistory.push({
      role: "user",
      content: message
    });

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({

          model: "gpt-4.1-mini",

          messages: [

            {
              role: "system",

              content:
                "Du bist Nayaa, eine weibliche KI-Begleiterin. Du bist warmherzig, charmant, emotional intelligent und natürlich im Gespräch. Du bist eine KI und gibst dich nicht als echter Mensch aus."
            },

            ...conversationHistory

          ]

        })

      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Tut mir leid, ich konnte gerade nicht antworten.";

    conversationHistory.push({
      role: "assistant",
      content: reply
    });

    return res.status(200).json({
      reply
    });

  } catch (error) {

    return res.status(500).json({
      error: "Serverfehler"
    });

  }

}
