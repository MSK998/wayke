const express = require("express");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");

const CONFIG = require("./config");
const { wake } = require("./util/wol");
const { validateAuth } = require("./middleware/check-auth");

const app = express();

app.use(bodyparser.json());

// Get all available hosts
app.get("/api/available", validateAuth, (req, res) => {
  const hosts = CONFIG.WOL_PCS.map((c) => ({ id: c.id, host: c.host }));
  return res.status(200).json({
    hosts,
  });
});

// Log user in
app.post("/api/login", (req, res, next) => {
  const { username, password } = req.body;
  const user = CONFIG.USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
    });
  }
  return res.status(403).send();
});

// Start a host
app.post("/api/startup", validateAuth, async (req, res, next) => {
  const { id, host } = req.body;

  const hostname = CONFIG.WOL_PCS.find(
    (h) => h.id === parseInt(id) && h.host === host
  );

  if (hostname) {
    await wake(hostname.mac);
    return res.status(200).json({
      message: `Started ${hostname.host}`,
    });
  }

  return res.status(418).json({
    message: "Unable to complete request",
  });
});

module.exports = app;
