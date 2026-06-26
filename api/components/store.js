const database = require("./db");
const util = require("util");
const { parseISO, format, isValid, set } = require("date-fns");
const { toDate } = require("date-fns-tz");

const db = database.connect();
const query = util.promisify(db.query).bind(db);

function getAulas() {
  return new Promise((resolve, reject) => {
    const sqlSelect = `SELECT cveaula, cveedif , nombre , capaci , disp , pos  FROM aula
		                   ORDER BY pos , cveaula `;
    db.query(sqlSelect, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }).catch((err) => {
    throw new Error(err);
  });
}

function getEdificios() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT cveedif, nombre, ubic FROM edificio ORDER BY cveedif`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }).catch((err) => {
    throw new Error(err);
  });
}

function getPlaneacionSemana(dias) {
  if (!Array.isArray(dias) || dias.length === 0) {
    console.error(
      "Error: 'dias' debe ser un arreglo con al menos una fecha válida.",
    );
    return Promise.reject({
      error: "Fechas inválidas",
      details:
        "El parámetro 'dias' debe ser un array con fechas en formato YYYY-MM-DD.",
    });
  }

  const formattedDates = dias
    .map((dia) => {
      const parsedDate = parseISO(dia);
      if (!isValid(parsedDate)) {
        console.error("Error: Una de las fechas tiene un formato incorrecto.");
        return null;
      }
      return format(parsedDate, "yyyy-MM-dd");
    })
    .filter(Boolean);

  if (formattedDates.length === 0) {
    return Promise.reject({
      error: "Fechas inválidas",
      details: "Ninguna fecha válida proporcionada.",
    });
  }

  return new Promise((resolve, reject) => {
    const placeholders = formattedDates
      .filter((f) => f)
      .map((f) => `'${format(parseISO(f), "yyyy-MM-dd")}'`)
      .join(", ");
    const sqlSelect = `
			SELECT
    		p.cvecurso, p.curso,
  			COALESCE(p.fecini, '1970-01-01') AS fecini,
			COALESCE(p.fecfin, '1970-01-01') AS fecfin,
			p.numasist, p.coord,
			COALESCE(p.observacion_estado, 0) AS observacion_estado,
			p.observador_nombre,
			p.observacion_comentarios,
			a.cveaula, a.cveedif, a.nombre, a.capaci, a.disp, a.pos
			FROM plancurso p
			JOIN aula a ON p.cveaula = a.cveaula
			WHERE DATE(p.fecini) IN (${placeholders})
			ORDER BY a.pos, p.fecini`;

    db.query(sqlSelect, formattedDates, (err, result) => {
      if (err) {
        console.error("Error al obtener planeación de la semana:", err.message);
        return reject({ error: "Error en la consulta", details: err.message });
      }
      resolve(result);
    });
  });
}

function insertCursoSemana({ ...curso }) {
  return new Promise((resolve, reject) => {
    const sqlInsert = `INSERT INTO plancurso (curso, cveaula, fecini, fecfin, numasist, coord) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      sqlInsert,
      [
        curso.curso,
        curso.cveaula,
        curso.fecini,
        curso.fecfin,
        curso.numasist,
        curso.coord,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al insertar curso:", err.message);
          return reject({
            error: "Error en la inserción",
            details: err.message,
          });
        }
        resolve("OK");
      },
    );
  });
}

function deleteCursoSemana(id) {
  return new Promise((resolve, reject) => {
    const sqlDelete = `DELETE FROM plancurso WHERE cvecurso = ? `;

    db.query(sqlDelete, [id], (err, result) => {
      if (err) reject(err);

      resolve("OK");
    });
  }).catch((err) => {
    throw new Error(err);
  });
}

function updateCursoSemana({ ...curso }) {
  // Validar formato de fechas
  if (!isValid(parseISO(curso.fecini)) || !isValid(parseISO(curso.fecfin))) {
    throw new Error("Formato de fecha inválido. Use 'YYYY-MM-DD'");
  }

  // Validar formato de horas
  if (
    !curso.horaini ||
    curso.horaini.length !== 5 ||
    !curso.horafin ||
    curso.horafin.length !== 5
  ) {
    throw new Error("Formato de hora inválido. Use 'HH:mm'");
  }

  // Convertir fechas y establecer horas
  const fecini = set(parseISO(curso.fecini), {
    hours: parseInt(curso.horaini.substring(0, 2)),
    minutes: parseInt(curso.horaini.substring(3, 5)),
    seconds: 0,
  });

  const fecfin = set(parseISO(curso.fecfin), {
    hours: parseInt(curso.horafin.substring(0, 2)),
    minutes: parseInt(curso.horafin.substring(3, 5)),
    seconds: 0,
  });

  // Convertir fechas a la zona horaria de México antes de almacenar en MySQL
  const feciniUtc = format(
    toDate(fecini, { timeZone: "America/Mexico_City" }),
    "yyyy-MM-dd HH:mm:ss",
  );
  const fecfinUtc = format(
    toDate(fecfin, { timeZone: "America/Mexico_City" }),
    "yyyy-MM-dd HH:mm:ss",
  );

  return new Promise((resolve, reject) => {
    const sqlUpdate = `UPDATE plancurso SET curso = ?, cveaula = ?, numasist = ?, coord = ?, fecini = ?, fecfin = ? WHERE cvecurso = ?`;

    db.query(
      sqlUpdate,
      [
        curso.curso,
        curso.cveaula,
        curso.numasist,
        curso.coord,
        feciniUtc,
        fecfinUtc,
        curso.cvecurso,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve("OK");
      },
    );
  }).catch((err) => {
    throw new Error(err);
  });
}

async function marcarNoObservado(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return "OK";
  const placeholders = ids.map(() => "?").join(", ");
  const sql = `
    UPDATE plancurso
    SET observacion_estado = 3
    WHERE cvecurso IN (${placeholders})
      AND observacion_estado = 1
  `;
  await query(sql, ids);
  return "OK";
}

async function updateObservacionBatch({
  ids,
  observacion_estado,
  observador_nombre,
  observacion_comentarios,
}) {
  const placeholders = ids.map(() => "?").join(", ");
  const sql = `
    UPDATE plancurso
    SET observacion_estado = ?,
        observador_nombre = ?,
        observacion_comentarios = ?
    WHERE cvecurso IN (${placeholders})
  `;
  await query(sql, [
    observacion_estado,
    observador_nombre,
    observacion_comentarios,
    ...ids,
  ]);
  return "OK";
}

async function updateAulasOrden(aulas) {
  for (const { cveaula, pos } of aulas) {
    await query(`UPDATE aula SET pos = ? WHERE cveaula = ?`, [pos, cveaula]);
  }
  return "OK";
}

function insertAula({ cveaula, cveedif, nombre, capaci, disp, pos }) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO aula (cveaula, cveedif, nombre, capaci, disp, pos) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [cveaula, cveedif, nombre, capaci, disp, pos], (err) => {
      if (err) {
        console.error("Error al insertar aula:", err.message);
        return reject(err.message);
      }
      resolve("OK");
    });
  });
}

// ✅ NUEVO: actualizar datos del aula (solo nombre y capacidad)
function updateAula({ cveaula, nombre, capaci }) {
  return new Promise((resolve, reject) => {
    const sqlUpdate = `UPDATE aula SET nombre = ?, capaci = ? WHERE cveaula = ?`;
    db.query(sqlUpdate, [nombre, capaci, cveaula], (err) => {
      if (err) {
        console.error("Error al actualizar aula:", err.message);
        return reject(err.message);
      }
      resolve("OK");
    });
  });
}

module.exports = {
  getAulas,
  getEdificios,
  getPlaneacionSemana,
  insertCursoSemana,
  updateCursoSemana,
  deleteCursoSemana,
  marcarNoObservado,
  updateObservacionBatch,
  updateAulasOrden,
  insertAula,
  updateAula,
};
