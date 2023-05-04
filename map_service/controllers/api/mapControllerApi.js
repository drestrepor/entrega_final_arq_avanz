const Bicicleta = require("../../models/bicicleta.js");

exports.list = function (req, res) {
  Bicicleta.getAll().then((bicis) => {
    res.status(200).json({ data: bicis });
  });
};