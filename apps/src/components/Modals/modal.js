import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

export const Background = styled.div`
	width: 100%;
	height: 100%;

	position: fixed;
	top: 140px;
	display: flex;
	justify-content: center;
	padding-top: 20px;
`;

export const ModalWrapper = styled.div`
	width: 600px;
	height: 390px;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
	background: #fff;
	color: #000;
	display: grid;
	${'' /* grid-template-columns: 1fr 1fr; */}
	position: relative;
	z-index: 10;
	border-radius: 10px;
	margin-top: 0px;
`;

export const ModalWrapperEliminar = styled.div`
	width: 400px;
	height: 190px;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
	background: #ff8fa3;
	color: #000;
	${'' /* grid-template-columns: 1fr 1fr; */}

	z-index: 10;
	border-radius: 10px;
	margin-top: 0px;
`;

export const ModalWrapperModifFecha = styled.div`
	width: 580px;
	height: 120px;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
	background: #fff;
	color: #000;
	display: grid;
	${'' /* grid-template-columns: 1fr 1fr; */}
	position: relative;
	z-index: 10;
	border-radius: 10px;
	margin-top: 0px;
`;

export const ModalImg = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 10px 0 0 10px;
	background: #000;
`;

export const ModalContent = styled.div`
    margin-top: -30px;
	padding: 20px;
	color: #141414;
	font-size: 20px;
	background-color: #ffff3f;
	};
`;

export const ModalContentEliminar = styled.div`
    margin-top: -30px;
	padding: 20px;
	color: #141414;
	font-size: 20px;
	background-color: #f0efeb;
	};
`;

export const ModalContentModifFecha = styled.div`
    margin-top: 0px;
	padding: 20px;
	color: #141414;
	font-size: 20px;
	background-color: #8ecae6;
	};
`;

export const CloseModalButton = styled(MdClose)`
	cursor: pointer;
	position: absolute;
	top: 20px;
	right: 20px;
	width: 32px;
	height: 32px;
	padding: 0;
	z-index: 10;
`;
