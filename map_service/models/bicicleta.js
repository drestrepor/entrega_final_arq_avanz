var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('bicicletas.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the bicicletas database.');
});

let Bicicleta = function (id, color, modelo, latitud, longitud) {
  this.id = id;
  this.color = color;
  this.modelo = modelo;
  this.latitud = latitud;
  this.longitud = longitud;
};
Bicicleta.prototype.toString = function () {
  return `id: ${this.id} | color: ${this.color}`;
};

Bicicleta.getAll = function () {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Bicicletas", function(err, rows) {
      var newRows = rows.map((x)=>({
        id: x.id,
        ubicacion: [x.latitud, x.longitud]
      }));
      console.log(newRows);
      resolve(newRows);
    });
  });
};

module.exports = Bicicleta;
