/*
*	Helper function
*/

module.exports = {
	isEmpty : (val) => {
		if(typeof(val) !== "undefined" && val !== ""){
			return false;
		} else return true;
	}
}