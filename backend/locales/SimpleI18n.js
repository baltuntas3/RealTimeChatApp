const fs = require("fs");

class SimpleI18n {
    constructor(defaultLocale = "tr") {
        this.defaultLocale = defaultLocale;
        this.translations = {};
    }

    init(req, res, next) {
        this.defaultLocale = req.headers["accept-language"] || "tr";
        this.findLocaleFile(this.defaultLocale);
        const t = (key) => this.translations[key] || key;
        res.locals.t = t;
        next();
    }

    findLocaleFile(locale) {
        if (locale.split(";")[0].toLowerCase().includes("en")) {
            this.translations = JSON.parse(fs.readFileSync(`${__dirname}/en.json`, "utf-8"));
        } else {
            this.translations = JSON.parse(fs.readFileSync(`${__dirname}/tr.json`, "utf-8"));
        }
    }
}

module.exports = new SimpleI18n();
