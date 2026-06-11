// PM2 konfiguracija — pokretanje na Mac Miniju pored postojećih aplikacija
module.exports = {
  apps: [
    {
      name: "svadbeni-bendovi",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
