const useApiREST = () => {
	const post = async (url, data) => {
		return await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		});
	};

	const get = async (url) => {
		return await fetch(url);
	};

	return {
		post,
		get,
	};
};

export default useApiREST;
