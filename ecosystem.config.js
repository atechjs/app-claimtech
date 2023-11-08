module.exports = {
  apps: [
    {
      name: "app_claimot",
      script: "node_modules/next/dist/bin/next",
      args: "start -- --hostname 192.168.1.234 --port 3005",
    },
  ],
};
