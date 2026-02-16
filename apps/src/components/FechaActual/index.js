import { parseISO, format, isValid, addDays, startOfWeek } from 'date-fns';

export const addLeadingZeros = (n) => {
	return n.toString().padStart(2, '0');
};

export const FechaHoy = () => {
	return format(new Date(), 'yyyy-MM-dd');
};

export const getPrimerdiasemana = (dia) => {
	const fecha = parseISO(dia);
	if (!isValid(fecha)) throw new Error(`Fecha inválida: ${dia}`);

	const primerDiaSemana = startOfWeek(fecha, { weekStartsOn: 1 });
	const anio = format(primerDiaSemana, 'yyyy');
	const mes = format(primerDiaSemana, 'MM');
	const dini = format(primerDiaSemana, 'dd');
	const dfin = format(addDays(primerDiaSemana, 4), 'dd');

	return { anio, mes, dini, dfin };
};

export const addingDate = (fecha, dias) => {
	const fechalocal = parseISO(fecha);
	if (!isValid(fechalocal)) throw new Error(`Fecha inválida: ${fecha}`);
	return addDays(fechalocal, dias); // Devuelve un objeto Date en lugar de una cadena
};

export const fechassemana = (primerdia, dia) => {
	const primerDiaInfo = getPrimerdiasemana(primerdia);
	const nuevaFecha = addingDate(`${primerDiaInfo.anio}-${primerDiaInfo.mes}-${primerDiaInfo.dini}`, dia);
	return format(nuevaFecha, 'dd/MM/yyyy');
};

export const extractFecha = (fechahora) => {
	return {
		anio: format(fechahora, 'yyyy'),
		mes: format(fechahora, 'MM'),
		dia: format(fechahora, 'dd'),
	};
};
