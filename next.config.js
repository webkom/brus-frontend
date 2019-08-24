// next.config.js

module.exports = {
  target: "serverless",
  webpack: function(cfg) {
    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();

      if (
        entries["main.js"] &&
        !entries["main.js"].includes("@babel/polyfill")
      ) {
        entries["main.js"].unshift("@babel/polyfill");
      }

      return entries;
    };

    return cfg;
  }
};
