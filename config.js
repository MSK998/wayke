const config = {
  WOL_PCS: [
    {
      id: 1,
      host: "MSK_PC",
      mac: process.env.PC_MAC,
    },
  ],

  USERS: [
    {
      username: process.env.WAYKE_USER,
      password: process.env.WAYKE_PASS,
    },
  ],
};

module.exports = config;
