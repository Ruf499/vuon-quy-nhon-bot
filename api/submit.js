export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = await req.formData();

    const telegram = formData.get("telegram") || "Не указан";
    const goal = formData.get("goal") || "Не указано";
    const use = formData.get("use") || "Не указано";
    const input = formData.get("input") || "Не указано";
    const email = formData.get("email") || "Не указан";

    const botToken = process.env.BOT_TOKEN;
    const adminChatId = process.env.ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      return res.status(500).json({
        error: "Telegram settings are not configured"
      });
    }

    const message =
      `📥 Новая заявка Vuon Quy Nhơn\n\n` +
      `👤 Telegram: ${telegram}\n` +
      `🎯 Направление: ${goal}\n` +
      `📌 Использование: ${use}\n` +
      `⌨️ Ввод: ${input}\n` +
      `📧 Email: ${email}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error(telegramResult);

      return res.status(500).json({
        error: "Failed to send Telegram message"
      });
    }

    const file = formData.get("file");

    if (file && typeof file !== "string" && file.size > 0) {
      const telegramForm = new FormData();

      telegramForm.append("chat_id", adminChatId);
      telegramForm.append("document", file, file.name);

      await fetch(
        `https://api.telegram.org/bot${botToken}/sendDocument`,
        {
          method: "POST",
          body: telegramForm
        }
      );
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
