const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const VALID_KEYS = ["1month", "3month", "lifetime"];
const API_KEY = "OGGYxKRISH";

app.get("/tg", async (req, res) => {
  const { key, id } = req.query;

  if (!key || !VALID_KEYS.includes(key)) {
    return res.json({ success: false, msg: "Invalid or missing key" });
  }

  if (!id) {
    return res.json({ success: false, msg: "Missing Telegram ID" });
  }

  try {
    const response = await fetch(
      `https://api.igfollows.site/TG/index.php?type=user&key=${API_KEY}&term=${id}`
    );
    const data = await response.json();

    if (!data.success) {
      return res.json({ success: false, msg: "User not found" });
    }

    const { country, country_code, msg, number, success, tg_id } = data.result;
    return res.json({ success: true, result: { tg_id, country, country_code, number, msg } });

  } catch (e) {
    return res.json({ success: false, msg: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
