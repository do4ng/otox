function isCapitalized(str) {
  return str[0] === str[0].toUpperCase();
}

const parse = function (args) {
  args = args.slice(2);
  const command = args[0];
  const options = {};
  const params = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (value) {
        options[key] = value;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith("-")) {
      if (arg.length === 2) {
        options[arg[1]] = true;
      } else {
        options[arg.slice(1)] = true;
      }
    } else {
      params.push(arg);
    }
  }

  return {
    command,
    options,
    params,
  };
};

const parseWithOptions = function (args, options) {
  const { command, options: parsedOptions, params } = parse(args);
  const outOpt = {};
  Object.keys(parsedOptions).forEach((key) => {
    if (key.length === 1) {
      if (Object.values(options).includes(key)) {
        outOpt[Object.keys(options)[Object.values(options).indexOf(key)]] =
          parsedOptions[key];
      } else if (Object.values(options).includes(key.toLowerCase())) {
        outOpt[
          Object.keys(options)[
            Object.values(options).indexOf(key.toLowerCase())
          ]
        ] = parsedOptions[key];
      } else {
        outOpt[key] = parsedOptions[key];
      }
    } else {
      outOpt[key] = parsedOptions[key];
    }
  });
  return {
    command,
    options: outOpt,
    params,
  };
};

module.exports.parse = parse;
module.exports.parseWithOptions = parseWithOptions;
// module.exports.isCapitalized = isCapitalized;
