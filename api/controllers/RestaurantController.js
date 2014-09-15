/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getRevenue: function(req, res) {
		var ObjectID = require('mongodb').ObjectID; 

		Action.find()
		.where({action: 'submitOrder'})
		.where({restaurantID: [new ObjectID(req.param('restaurantID'))]})
		.exec(function(err, actions) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(actions.length);

			var resultWithDuplicateDate = [];
			var startDate = null;
			var endDate = null;

			actions.forEach(function(order) {
				var purchase = {};
				var date = new Date(order['timeStamp']);
				
				if (startDate === null || date < startDate) startDate = date;
				if (endDate === null || date > endDate) endDate = date;

				purchase['date'] = date;
				purchase['amount'] = 0;

				order['items'].forEach(function(item) {
					purchase['amount'] +=  item['price'];
				});

				resultWithDuplicateDate.push(purchase);
			});
			
			resultWithDuplicateDate.sort(function(a, b) {
				if (a['date'] < b['date']) return -1;
				if (a['date'] > b['date']) return 1;
				return 0;});

			var revenueInfo = [];
			var pos = 0;

			do {	
				var curLength = revenueInfo.length;
				revenueInfo[curLength] = {'date': DateConverter.toString(startDate), 'amount': 0.0};

				while (pos < resultWithDuplicateDate.length) {
					var order = resultWithDuplicateDate[pos];
					if (DateConverter.compare(startDate, order['date']) !== 0) break;
					pos = pos + 1;

					revenueInfo	[curLength]['amount'] += order['amount'];
				}
					
				startDate.setDate(startDate.getDate() + 1);
			}
			while(DateConverter.compare(startDate, endDate) != 0)
			
			var result = {};
			result['restaurantID'] = req.param('restaurantID');
			result['revenueInfo'] = revenueInfo;
			res.json(result);
		});
	},

	getTopDishes: function(req, res) {
		var ObjectID = require('mongodb').ObjectID; 

		Action.find()
		.where({action: 'submitOrder'})
		.where({restaurantID: [new ObjectID(req.param('restaurantID'))]})
		.exec(function(err, actions) {
			if (err) {
				console.log(err);
				return;
			}

			var duplicatedPurchaseList = [];
			actions.forEach(function(action) {
				action['items'].forEach(function(item) {
					var purchase = {};
					purchase['item'] = item['name'];
					if (req.param('sortBy').localeCompare('revenue') === 0)
						purchase['amount'] = item['price'];
					else 
						purchase['amount'] = 1;

					duplicatedPurchaseList.push(purchase);
				});
			});

			duplicatedPurchaseList.sort(function(a, b) {
				return (a['item'].localeCompare(b['item']));
			});

			var purchaseList = [];
			duplicatedPurchaseList.forEach(function(purchase) {
				if (purchaseList.length === 0) {
					purchaseList.push(purchase);
					return;
				}

				var lastIndex = purchaseList.length - 1
				if (purchaseList[lastIndex]['item'].localeCompare(purchase['item']) === 0) {
					purchaseList[lastIndex]['amount'] += purchase['amount'];
				}
				else purchaseList.push(purchase);
			});			

			purchaseList.sort(function(a, b) {
				return b['amount'] - a['amount'];
			});

			var top = 3;
			var totalAmount = 0;
			purchaseList.forEach(function(entry) {
				totalAmount += entry['amount'];
			});

			var result = {};
			result['restaurantID'] = req.param('restaurantID');
			result['topDishes'] = []

			var otherAmount = totalAmount;
			for (var i = 0; i < Math.min(top, purchaseList.length); i++) {
				var item = {};
				item['name'] = purchaseList[i]['item'];
				item['amount'] = purchaseList[i]['amount'];
				otherAmount -= purchaseList[i]['amount'];

				result['topDishes'].push(item);
			}

			var other = {};
			other['name'] = 'other';
			other['amount'] = otherAmount;
			result['topDishes'].push(other);
			result['sortBy'] = req.param('sortBy');
			
			res.send(result);
		});
	}
};

