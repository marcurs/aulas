const database = require('./db');
const util = require('util');

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

function getPlaneacionSemana(dia,days,months,years) {
	return new Promise((resolve, reject) => {	
		const sqlSelect = `SELECT p.cvecurso as cvecurso, p.curso , CONVERT_TZ(FROM_UNIXTIME(fecini), 'UTC', 'America/Mexico_City') as fecini ,
		CONVERT_TZ(FROM_UNIXTIME(p.fecfin), 'UTC', 'America/Mexico_City') as fecfin , p.numasist , p.coord , a.cveaula , a.cveedif , a.nombre , a.capaci , a.disp , a.pos
		FROM plancurso_1 p 
                                JOIN aula a ON p.cveaula = a.cveaula
				WHERE YEAR(FROM_UNIXTIME(p.fecini)) IN (?)
				AND MONTH(FROM_UNIXTIME(p.fecini)) IN (?)
				AND DAY(FROM_UNIXTIME(p.fecini)) IN (?)
				ORDER BY a.pos , p.fecini `;


		db.query(sqlSelect, [years, months, days] ,(err, result) => {
			if (err) reject(err);
			resolve(result);
		});
		//resolve('OK');
	}).catch((err) => {
		throw new Error(err);
	});
}


function insertCursoSemana({ ...curso }) {
	return new Promise((resolve, reject) => {
		const sqlInsert = `INSERT INTO plancurso_1(curso,cveaula,fecini,fecfin,numasist,coord) VALUES(?,?,?,?,?,?) `;

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
				if (err) reject(err);

				resolve('OK');
			}
		);
		resolve('OK');
	}).catch((err) => {
		throw new Error(err);
	});
}

function deleteCursoSemana(id) {
	return new Promise((resolve, reject) => {
		const sqlDelete = `DELETE FROM plancurso_1 WHERE cvecurso = ? `;

		db.query(sqlDelete, [id], (err, result) => {
			if (err) reject(err);

			resolve('OK');
		});
	}).catch((err) => {
		throw new Error(err);
	});
}

//21600000 - daysaving light (summer)
function updateCursoSemana({ ...curso }) {
const fecin = (new Date(curso.fecini + ' ' + curso.horaini + ':'+'00').getTime()-21560000)/1000
	return new Promise((resolve, reject) => {
		const sqlUpdate = `UPDATE plancurso_1 SET curso = ? , cveaula = ? ,	numasist = ? , coord = ? , fecini = ? , fecfin = ? WHERE cvecurso = ? `;

		db.query(
			sqlUpdate,
			[
				curso.curso,
				curso.cveaula,
				curso.numasist,
				curso.coord,
				(new Date(curso.fecini + ' ' + curso.horaini + ':'+'00').getTime()-21560000)/1000,
				(new Date(curso.fecfin + ' ' + curso.horafin + ':'+'00').getTime()-21560000)/1000,
				curso.cvecurso,
			],
			(err, result) => {
				if (err) reject(err);

				resolve('OK');
			}
		);
	}).catch((err) => {
		throw new Error(err);
	});
}

module.exports = {
	getAulas,
	getPlaneacionSemana,
	insertCursoSemana,
	updateCursoSemana,
	deleteCursoSemana,
};
