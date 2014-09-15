exports.toString = function (dateObj) {
			dateString = '';

			date = (dateObj.getDate()).toString();
			if (date.length < 2) date = '0' + date;

			//getMonth() return value in range [0..11]
			month = (dateObj.getMonth() + 1).toString();
			if (month.length < 2) month = '0' + month;

			year = dateObj.getFullYear();

			dateString = date + '-' + month + '-' + year;
			return dateString;
		}

exports.compare = function(a, b) {
			return DateConverter.toString(a).localeCompare(DateConverter.toString(b));
}