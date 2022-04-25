const path = require("path");
const fs = require("fs");

function createConfig(dir) {
  fs.writeFileSync(
    dir("setting.json"),
    JSON.stringify({
      useAutoSave: true,
      log: dir("app.json"),
    })
  );
}

module.exports.remove = function remove(cwd) {
  const outDir = path.join(cwd, ".otox");
  const dir = (d) => path.join(outDir, d);

  if (fs.existsSync(dir("app.json"))) {
    fs.rmSync(dir("app.json"));
  }
};

module.exports.saver = function saver(cwd, data) {
  const outDir = path.join(cwd, ".otox");
  const dir = (d) => path.join(outDir, d);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
    createConfig(dir);
  } else if (!fs.existsSync(dir("setting.json"))) {
    createConfig(dir);
  }
  if (!fs.existsSync(dir("app.json"))) {
    fs.writeFileSync(dir("app.json"), JSON.stringify([]));
  }
  const df = fs.readFileSync(dir("app.json")).toString();
  const cfg = JSON.parse(fs.readFileSync(dir("setting.json")).toString());

  if (cfg.useAutoSave) {
    fs.writeFileSync(
      dir("app.json"),
      JSON.stringify([...JSON.parse(df), data])
    );
  }
};

module.exports.loader = function loader(cwd) {
  const outDir = path.join(cwd, ".otox");
  const dir = (d) => path.join(outDir, d);

  if (!fs.existsSync(outDir)) {
    return [];
  } else if (!fs.existsSync(dir("setting.json"))) {
    return [];
  }
  const df = fs.readFileSync(dir("app.json")).toString();
  const cfg = JSON.parse(fs.readFileSync(dir("setting.json")).toString());

  if (cfg.useAutoSave) {
    return JSON.parse(df);
  } else {
    return [];
  }
};
