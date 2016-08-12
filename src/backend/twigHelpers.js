
module.exports = (twig) => {
	
	twig.extendFunction("date", (value) => {
    	return new Date(value).toLocaleString();
	});
}