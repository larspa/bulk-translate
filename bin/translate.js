#!/usr/bin/env node
var commandLineArgs = require("command-line-args");
var commandLineUsage = require("command-line-usage");
var readline = require("readline");
var chalk = require("chalk");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var translate = require("../lib/index.js");

var config = {
  text: {
    question: "What is the text which should be translated?",
    args: {
      name: "text",
      type: String,
      typeLabel: "{underline string}",
      description: "The to be translated text"
    }
  },
  from: {
    question: "From which language? (ISO codes only) ",
    args: {
      name: "from",
      alias: "f",
      type: String,
      typeLabel: "{underline string}",
      description:
        "The language from which the text should be translated (ISO codes only)"
    }
  },
  to: {
    question: "To which languages do you want it translated? (ISO codes only) ",
    parse: val => (typeof val === "string" ? val.split(" ") : val),
    args: {
      name: "to",
      alias: "t",
      type: String,
      multiple: true,
      typeLabel: "{underline string}",
      description:
        "The languages to which the text should be translated (ISO codes only)"
    }
  }
};

var optionList = [
  ...Object.keys(config).map(k => config[k].args),
  {
    name: "help",
    alias: "h",
    type: Boolean,
    typeLabel: "{underline string}",
    description: "Most usefull guide ever"
  }
];

var options = commandLineArgs(optionList);

if (options.help) {
  console.log(
    commandLineUsage([
      {
        header: "A tool to translate in bulks",
        content: "Translate given piece of text to the given languages"
      },
      {
        header: "Options",
        optionList
      }
    ])
  );
  process.exit(0);
} else {
  var gatherKeys = Object.keys(config);
  function gather(i) {
    var key = gatherKeys[i];

    if (key) {
      if (!options[key]) {
        rl.question(config[key].question, val => {
          options[key] = config[key].parse ? config[key].parse(val) : val;
          gather(i + 1);
        });
      } else {
        gather(i + 1);
      }
    } else {
      final();
    }
  }

  function final() {
    translate(options.text, { from: options.from, to: options.to })
      .then(res => {
        res.forEach((r, i) =>
          console.log(chalk.yellow(options.to[i]), chalk.green(r.text))
        );
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(0);
      });
  }

  gather(0);
}

rl.on("close", function() {
  process.exit(0);
});
