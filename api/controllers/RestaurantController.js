/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getRevenue: function(req, res) {
		var ObjectID = require('mongodb').ObjectID; 

		Action.find().where({restaurantID: [new ObjectID(req.param('restaurantID'))]}).exec(function(err, actions) {
			if (err) {
				console.log(err);
				return;
			}

			var resultWithDuplicateDate = [];
			var startDate = null;
			var endDate = null;

			actions.forEach(function(order) {
				var line = {};
				var date = new Date(order['timeStamp']);
				
				if (startDate === null || date < startDate) startDate = date;
				if (endDate === null || date > endDate) endDate = date;

				if (date > endDate) endDate = date;
				line['date'] = date;
				line['amount'] = 0;

				order['items'].forEach(function(item) {
					line['amount'] +=  item['price'];
				});

				resultWithDuplicateDate.push(line);
			});
			
			resultWithDuplicateDate.sort(function(a, b) {
				if (a['date'] < b['date']) return -1;
				if (a['date'] > b['date']) return 1;
				return 0;});

			var revenueInfo = [];
			var pos = 0;

			while (true) {	
				var curLength = revenueInfo.length;
				revenueInfo[curLength] = {'date': DateConverter.toString(startDate), 'amount': 0.0};

				while (pos < resultWithDuplicateDate.length) {
					var order = resultWithDuplicateDate[pos];
					if (DateConverter.compare(startDate, order['date']) !== 0) break;
					pos = pos + 1;

					revenueInfo	[curLength]['amount'] += order['amount'];
				}
					
				startDate.setDate(startDate.getDate() + 1);
				if (DateConverter.compare(startDate, endDate) == 0) break;
			}
			
			var result = {};
			result['restaurantID'] = req.param('restaurantID');
			result['revenueInfo'] = revenueInfo;
			res.json(result);
		});
	}
};

