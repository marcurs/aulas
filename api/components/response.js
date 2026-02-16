const messages = [
	{
		key: 'ER_DUP_ENTRY',
		message: 'EL CICLO YA FUE DADO DE ALTA',
	},
	{
		key: 'ER_BAD_FIELD_ERROR',
		message: 'ERROR en Sentencia SQL',
	},
];

exports.success = function (req, res, message, status) {
	res.status(status || 200).send(message);
};

exports.error = function (req, res, message, status, details) {
	if (typeof message !== 'undefined') {
		const msg = messages.find((o) => o.key === message.code);
		if (typeof msg !== 'undefined') {
			res.statusMessage = msg.message;
		} else {
			res.statusMessage = message;
		}
		res.status(status || 500).send(message);
	} else {
		res.status(500).send('ERROR: error inesperado en la aplicación');
	}
};
