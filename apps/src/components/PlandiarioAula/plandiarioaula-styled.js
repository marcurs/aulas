import styled from 'styled-components';

export const InformacionCurso = styled.div`
	${'' /* position: static; */}
	background-color: #edf2fb;
	text-align: center;
	padding-right: 0px;
`;

export const FilaAula = styled.td`
	background-color: #edf2fb;
	margin: 0px auto;
	padding: 0px;
	width: 300px;
`;

export const FilaAulaDisponible = styled.td`
	background-color: #f6f2f0;
	margin: 0px auto;
	padding: 0px;
	width: 300px;
`;

export const CursoNombre = styled.p`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	${'' /* height: 55px; */}
	marginleft: 5px;
	margin-right: 5px;
`;

export const CoordAsist = styled.p`
	margin-top: -15px;
	color: purple;
	font-size: 12px;
	font-weight: bold;
`;

export const Horario = styled.div`
	display: flex;
	height: 20px;
	width: 100%;
	background-color: lightgrey;
	text-align: left;
	padding: 0px;
	overflow: hidden;
`;

export const HoraInicio = styled.p`
	width: 100%;
	margin-top: 2px;
	margin-left: 5px;
	color: blue;
	font-size: 13px;
	font-weight: bold;
`;

export const HoraFin = styled.p`
	width: 100%;
	margin-top: 2px;
	margin-left: 5px;
	color: blue;
	font-size: 13px;
	font-weight: bold;
	text-align: right;
	margin-right: 5px;
`;
