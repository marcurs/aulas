const store = require("./store");
const {
  parseISO,
  format,
  isValid,
  addDays,
  startOfWeek,
  set,
  differenceInCalendarDays,
} = require("date-fns");
const { toDate } = require("date-fns-tz");

//const DIA_LUNES = 1;
const DIA_MARTES = 2;
const DIA_MIERCOLES = 3;
const DIA_JUEVES = 4;
const DIA_VIERNES = 5;

/**                       FUNCIONES INTERNAS DEL API                           */

async function getCursosSemana(result, dia) {
  let plansemana = {
    LUNES: { fecha: "", cursos: [] },
    MARTES: { fecha: "", cursos: [] },
    MIERCOLES: { fecha: "", cursos: [] },
    JUEVES: { fecha: "", cursos: [] },
    VIERNES: { fecha: "", cursos: [] },
  };

  const fecha = parseISO(dia); // Convertir la fecha a formato Date
  const primerdiasemana = format(
    startOfWeek(fecha, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  ); // Obtener el lunes de esa semana

  plansemana.LUNES.fecha = primerdiasemana;
  plansemana.MARTES.fecha = format(
    addDays(primerdiasemana, DIA_MARTES),
    "yyyy-MM-dd",
  );
  plansemana.MIERCOLES.fecha = format(
    addDays(primerdiasemana, DIA_MIERCOLES),
    "yyyy-MM-dd",
  );
  plansemana.JUEVES.fecha = format(
    addDays(primerdiasemana, DIA_JUEVES),
    "yyyy-MM-dd",
  );
  plansemana.VIERNES.fecha = format(
    addDays(primerdiasemana, DIA_VIERNES),
    "yyyy-MM-dd",
  );

  result.map((curso) => {
    if (curso.fecini.split(" ")[0] === primerdiasemana) {
      plansemana.LUNES = {
        ...plansemana.LUNES,
        cursos: plansemana.LUNES.cursos.concat({
          cvecurso: curso.cvecurso,
          curso: curso.curso,
          cveaula: curso.cveaula,
          fecini: curso.fecini,
          fecfin: curso.fecfin,
          numasist: curso.numasist,
          coord: curso.coord,
          nombre: curso.nombre,
          capaci: curso.capaci,
          observacion_estado: curso.observacion_estado,
          observador_nombre: curso.observador_nombre,
          observacion_comentarios: curso.observacion_comentarios,
        }),
      };
    } else if (curso.fecini.split(" ")[0] === plansemana.MARTES.fecha) {
      plansemana.MARTES = {
        ...plansemana.MARTES,
        cursos: plansemana.MARTES.cursos.concat({
          cvecurso: curso.cvecurso,
          curso: curso.curso,
          cveaula: curso.cveaula,
          fecini: curso.fecini,
          fecfin: curso.fecfin,
          numasist: curso.numasist,
          coord: curso.coord,
          nombre: curso.nombre,
          capaci: curso.capaci,
          observacion_estado: curso.observacion_estado,
          observador_nombre: curso.observador_nombre,
          observacion_comentarios: curso.observacion_comentarios,
        }),
      };
    } else if (curso.fecini.split(" ")[0] === plansemana.MIERCOLES.fecha) {
      plansemana.MIERCOLES = {
        ...plansemana.MIERCOLES,
        cursos: plansemana.MIERCOLES.cursos.concat({
          cvecurso: curso.cvecurso,
          curso: curso.curso,
          cveaula: curso.cveaula,
          fecini: curso.fecini,
          fecfin: curso.fecfin,
          numasist: curso.numasist,
          coord: curso.coord,
          nombre: curso.nombre,
          capaci: curso.capaci,
          observacion_estado: curso.observacion_estado,
          observador_nombre: curso.observador_nombre,
          observacion_comentarios: curso.observacion_comentarios,
        }),
      };
    } else if (curso.fecini.split(" ")[0] === plansemana.JUEVES.fecha) {
      plansemana.JUEVES = {
        ...plansemana.JUEVES,
        cursos: plansemana.JUEVES.cursos.concat({
          cvecurso: curso.cvecurso,
          curso: curso.curso,
          cveaula: curso.cveaula,
          fecini: curso.fecini,
          fecfin: curso.fecfin,
          numasist: curso.numasist,
          coord: curso.coord,
          nombre: curso.nombre,
          capaci: curso.capaci,
          observacion_estado: curso.observacion_estado,
          observador_nombre: curso.observador_nombre,
          observacion_comentarios: curso.observacion_comentarios,
        }),
      };
    } else if (curso.fecini.split(" ")[0] === plansemana.VIERNES.fecha) {
      plansemana.VIERNES = {
        ...plansemana.VIERNES,
        cursos: plansemana.VIERNES.cursos.concat({
          cvecurso: curso.cvecurso,
          curso: curso.curso,
          cveaula: curso.cveaula,
          fecini: curso.fecini,
          fecfin: curso.fecfin,
          numasist: curso.numasist,
          coord: curso.coord,
          nombre: curso.nombre,
          capaci: curso.capaci,
          observacion_estado: curso.observacion_estado,
          observador_nombre: curso.observador_nombre,
          observacion_comentarios: curso.observacion_comentarios,
        }),
      };
    }
  });
  return plansemana;
}

async function getPlan(result, dia) {
  let planeacionsemana = [];
  const aulas = await store.getAulas();
  const planeacion = await getCursosSemana(result, dia);
  aulas.map((aula) => {
    planeacionsemana = planeacionsemana.concat({
      cveaula: aula.cveaula,
      nombre: aula.nombre,
      capaci: aula.capaci,
      cursos: [
        {
          LUNES: planeacion.LUNES.cursos
            .filter((curso) => curso.cveaula === aula.cveaula)
            .map((curso) => {
              return curso;
            }),
          MARTES: planeacion.MARTES.cursos
            .filter((curso) => curso.cveaula === aula.cveaula)
            .map((curso) => {
              return curso;
            }),
          MIERCOLES: planeacion.MIERCOLES.cursos
            .filter((curso) => curso.cveaula === aula.cveaula)
            .map((curso) => {
              return curso;
            }),
          JUEVES: planeacion.JUEVES.cursos
            .filter((curso) => curso.cveaula === aula.cveaula)
            .map((curso) => {
              return curso;
            }),
          VIERNES: planeacion.VIERNES.cursos
            .filter((curso) => curso.cveaula === aula.cveaula)
            .map((curso) => {
              return curso;
            }),
        },
      ],
    });
  });

  return planeacionsemana;
}

function getTodayMxYYYYMMDD() {
  // México (CDMX) en formato YYYY-MM-DD
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

/** ************************FIN FUNCIONES INTERNAS DEL API *********************************** */

/**                            FUNCIONES PUBLICAS DEL API                       */

function getAulas() {
  try {
    return store.getAulas();
  } catch (e) {
    throw new Error(e);
  }
}

async function getPlaneacionSemana(dia) {
  try {
    const fecha = parseISO(dia);
    if (!isValid(fecha))
      throw new Error("Fecha inválida. Use el formato YYYY-MM-DD.");

    const lunes = startOfWeek(fecha, { weekStartsOn: 1 });
    const diasSemana = Array.from({ length: 5 }, (_, i) =>
      format(addDays(lunes, i), "yyyy-MM-dd"),
    );

    const rows = await store.getPlaneacionSemana(diasSemana);

    // Auto-cálculo: Programada (1) -> No observado (3) si ya pasó el día (00:00 del día siguiente)
    const todayMx = getTodayMxYYYYMMDD();
    const expirados = rows
      .filter(
        (r) =>
          Number(r.observacion_estado) === 1 &&
          String(r.fecini).split(" ")[0] < todayMx,
      )
      .map((r) => r.cvecurso);

    // Opcional: persistir en BD en este mismo request
    if (expirados.length > 0) {
      await store.marcarNoObservado(expirados);
      // también actualizamos en memoria para que la respuesta ya salga correcta
      rows.forEach((r) => {
        if (expirados.includes(r.cvecurso)) r.observacion_estado = 3;
      });
    }

    return getPlan(rows, dia);
  } catch (e) {
    throw new Error(e);
  }
}

async function insertCursoSemana(cursos) {
  try {
    // Validar formato de fechas
    if (
      !isValid(parseISO(cursos.fecini)) ||
      !isValid(parseISO(cursos.fecfin))
    ) {
      throw new Error("Formato de fecha inválido. Use 'YYYY-MM-DD'");
    }

    // Validar formato de horas
    if (
      !cursos.horaini ||
      cursos.horaini.length !== 5 ||
      !cursos.horafin ||
      cursos.horafin.length !== 5
    ) {
      throw new Error("Formato de hora inválido. Use 'HH:mm'");
    }

    const startDate = parseISO(cursos.fecini);
    const endDate = parseISO(cursos.fecfin);

    // Calcular la cantidad total de registros a insertar (incluye ambos extremos)
    const totalIterations = differenceInCalendarDays(endDate, startDate) + 1;

    for (let i = 0; i < totalIterations; i++) {
      const currentDate = addDays(startDate, i);

      // Ajustar la hora de inicio para la fecha actual
      const startDateTime = set(currentDate, {
        hours: parseInt(cursos.horaini.substring(0, 2), 10),
        minutes: parseInt(cursos.horaini.substring(3, 5), 10),
        seconds: 0,
      });

      // Ajustar la hora de fin para la fecha actual
      const finishDateTime = set(currentDate, {
        hours: parseInt(cursos.horafin.substring(0, 2), 10),
        minutes: parseInt(cursos.horafin.substring(3, 5), 10),
        seconds: 0,
      });

      // Convertir fechas a la zona horaria de México antes de almacenar en MySQL
      const feciniUtc = format(
        toDate(startDateTime, { timeZone: "America/Mexico_City" }),
        "yyyy-MM-dd HH:mm:ss",
      );
      const fecfinUtc = format(
        toDate(finishDateTime, { timeZone: "America/Mexico_City" }),
        "yyyy-MM-dd HH:mm:ss",
      );

      // Insertar el registro
      await store.insertCursoSemana({
        ...cursos,
        fecini: feciniUtc,
        fecfin: fecfinUtc,
      });
    }

    return "OK";
  } catch (e) {
    throw new Error(e);
  }
}

function updateCursoSemana(cursos) {
  try {
    cursos.forEach((element) => {
      store.updateCursoSemana(element);
    });

    return new Promise((resolve) => resolve("OK"));
  } catch (e) {
    throw new Error(e);
  }
}

async function updateObservacionSemana(payload) {
  try {
    const ids = payload?.ids;
    const estado = Number(payload?.observacion_estado);

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("ids requerido: array con cvecurso");
    }
    if (![0, 1, 2, 3].includes(estado)) {
      throw new Error("observacion_estado inválido (0..3)");
    }

    const observador = (payload?.observador_nombre ?? "").trim();
    const comentarios = payload?.observacion_comentarios ?? null;

    if (estado === 2 && observador.length === 0) {
      throw new Error(
        "Para estado OBSERVADO es obligatorio capturar observador_nombre",
      );
    }

    // Si No aplica: limpiar
    const finalObservador =
      estado === 0 ? null : observador.length ? observador : null;
    const finalComentarios =
      estado === 0
        ? null
        : comentarios && String(comentarios).trim().length
          ? comentarios
          : null;

    await store.updateObservacionBatch({
      ids,
      observacion_estado: estado,
      observador_nombre: finalObservador,
      observacion_comentarios: finalComentarios,
    });

    return "OK";
  } catch (e) {
    throw new Error(e);
  }
}

function deleteCursoSemana(cursos) {
  try {
    cursos.forEach((element) => {
      store.deleteCursoSemana(element);
    });
    return new Promise((resolve) => resolve("OK"));
  } catch (e) {
    throw new Error(e);
  }
}

// ✅ NUEVO: actualizar datos del aula (solo nombre y capacidad)
async function updateAula(payload) {
  try {
    const cveaula = (payload?.cveaula ?? "").toString().trim();
    const nombre = (payload?.nombre ?? "").toString().trim();
    const capaci = Number(payload?.capaci);

    if (!cveaula) throw new Error("cveaula inválido");
    if (!nombre) throw new Error("nombre es requerido");
    if (!Number.isFinite(capaci) || capaci < 0)
      throw new Error("capaci inválido");

    await store.updateAula({ cveaula, nombre, capaci });
    return "OK";
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  getAulas,
  getPlaneacionSemana,
  insertCursoSemana,
  updateCursoSemana,
  deleteCursoSemana,
  updateObservacionSemana,
  updateAula,
};
