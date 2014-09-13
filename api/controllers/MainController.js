/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getRestaurantID: function(req, res) {
		Restaurant.find({}, function(err, restaurants) {
			idList = [];

			for (var i = 0; i < restaurants.length; i = i + 1) 
				idList.push({
					id: restaurants[i].id,
					name: restaurants[i].name
				});
			
			res.json(idList);
		});
	},

	getTopDishes: function (req, res) {
		//dummies data
		var dishes = ['Bak Kut Teh', 'Carrot Cake', 'Char Kway Teow', 'Chili Crab', 'Hainanese Chicken Rice',
				  'Satay', 'Laksa', 'Fish Head Curry', 'Roti Prata', 'Rojak'];

		restaurants = ['Chinese Restaurant', 'Singapore Restaurant', 'Royal Restaurant', 'Five Star Restaurant'];
		//end of dummies data

		random = function(n) {
			return Math.floor(Math.random() * n);
		};

		var topDishesInfo = {};
		
		topDishesInfo['restaurantID'] 		= req.param('restaurantID');
		topDishesInfo['restaurantName']		= restaurants[random(restaurants.length)];
		topDishesInfo['topDishes']			= [];

		for (i = 0; i < 3; i = i + 1) 
			topDishesInfo['topDishes'][i]	= {'name': dishes[random(dishes.length)], 'ordersCount': random(1000), 'revenue': random(5000)};
		topDishesInfo['others']				= {'ordersCount': random(5000), 'revenue': random(10000)};
			
		res.json(topDishesInfo);
	},

	getRevenue: function (req, res) {
		//dummies data
		restaurants = ['Chinese Restaurant', 'Singapore Restaurant', 'Royal Restaurant', 'Five Star Restaurant'];
		//end of dummies data

		random = function(n) {
			return Math.floor(Math.random() * n);
		};

		formatDate = function (dateObj) {
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

		var revenueInfo = {};
		revenueInfo['restaurantID'] 	= req.param('restaurantID');
		revenueInfo['restaurantName']	= restaurants[random(restaurants.length)];
		revenueInfo['currency']			= 'SDG';
		revenueInfo['revenueInfo']		= [];

		var today = new Date();
		for (i = 0; i < 30; i++) {
			today.setDate(today.getDate() + 1);
			revenueInfo['revenueInfo'][i] = {'date': formatDate(today), 'revenue': random(10000)}
		}

		res.json(revenueInfo);
	},

	getRestaurant: function(req, res) {
		Restaurant.find({ 'id': req.param('restaurantID') }, function(err, queryResult) {
			res.json(queryResult ? queryResult[0] : {error: 'Not found.'});
		});
	}
};

