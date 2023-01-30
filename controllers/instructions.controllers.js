const fs = require("fs/promises");

exports.getJSONInstructions = (req, res, next) => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
        .then((data) => {
            data = JSON.parse(data);
            res.status(200).send({ data });
        })
}