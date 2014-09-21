exports.toString = function (dateObj) {
			var date = (dateObj.getDate()).toString();
			if (date.length < 2) date = '0' + date;

			//getMonth() return value in range [0..11]
			var month = (dateObj.getMonth() + 1).toString();
			if (month.length < 2) month = '0' + month;

			var year = dateObj.getFullYear();

			var dateString = date + '-' + month + '-' + year;
			return dateString;
		}

exports.compare = function(a, b) {
			return DateConverter.toString(a).localeCompare(DateConverter.toString(b));
}

exports.toTimeStamp = function(dateString, max) {
	if (dateString === undefined || dateString === null) {
		if (max) return 100000000*86400000;
		else return 0;
	}

	var date 	= dateString.split('-');
	date 		= date[1] + ',' + date[0] + ',' + date[2];
	date 		= new Date(date);	 
	
	return date.getTime();
}