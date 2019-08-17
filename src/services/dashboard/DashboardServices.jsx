const getStaticData = () =>
	fetch('http://www.mocky.io/v2/5d585def2f0000c86d545587')
		.then(response => response.json());


const getFoodMenu = () =>
	fetch('https://www.mocky.io/v2/5d584da52f00007a6b54556c')
		.then(response => response.json());

export {
	getStaticData,
	getFoodMenu
}
