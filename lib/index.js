const chalk = require("chalk");
const translate = require("@vitalets/google-translate-api");
const languages = require("@vitalets/google-translate-api").languages;

function translateMulitple(text, { from, to }) {
  return Promise.all(
    to.map(t => {
      if (languages[t]) {
        return translate(text, { from, to: t });
      } else {
        return Promise.resolve({
          text: chalk.bgYellow(chalk.black("NOT SUPPORTED"))
        });
      }
    })
  );
}

module.exports = translateMulitple;
