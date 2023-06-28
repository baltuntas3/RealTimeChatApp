const fs = require("fs");

class SimpleI18n {
    constructor(defaultLocale = "tr") {
        this.defaultLocale = defaultLocale;
        this.translations = {};
    }

    init(req, res, next) {
        this.defaultLocale = req.headers["accept-language"] || "tr";
        const languages = this.sortByWeight(this.defaultLocale);
        this.findLocaleFile(languages);
        const t = (key) => this.translations[key] || key;
        res.locals.t = t;
        next();
    }

    findLocaleFile(locales) {
        if (locales[0].toLowerCase().includes("en")) {
            this.translations = JSON.parse(fs.readFileSync(`${__dirname}/en.json`, "utf-8"));
        } else {
            this.translations = JSON.parse(fs.readFileSync(`${__dirname}/tr.json`, "utf-8"));
        }
    }

    sortByWeight(languages) {
        languages = languages.split(",");
        const preferences = {};
        return languages
            .map((item) => {
                const preferenceParts = item.trim().split(";q=");
                if (preferenceParts.length < 2) {
                    preferenceParts[1] = 1.0;
                } else {
                    const quality = Number.parseFloat(preferenceParts[1]);
                    preferenceParts[1] = quality || 0.0;
                }
                preferences[preferenceParts[0]] = preferenceParts[1];

                return preferenceParts[0];
            })
            .filter((lang) => preferences[lang] > 0)
            .sort((a, b) => preferences[b] - preferences[a]);
    }
}

module.exports = new SimpleI18n();
