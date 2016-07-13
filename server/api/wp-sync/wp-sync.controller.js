'use strict';

var _ = require('lodash'),
    http = require('https'),
    url  = require('url');

// Get list of wp-syncs
exports.index = function(req, res) {
  res.json([{'deployed': 'yes'}]);
};

exports.sync = function(request, result) {
	var consumer_key = request.query.consumer_key;
	var consumer_secret = request.query.consumer_secret;
	var captivity_results = request.body;
	captivity_results = captivity_results.root.product;

	var options = {
		host: 'www.captivity.co.za',
		path: '/beta/wc-api/v3/products?filter[limit]=-1&consumer_key=' + consumer_key + '&consumer_secret=' + consumer_secret,
		headers: {
			"Content-Type": "application/json"
		},
		method: 'GET',
		rejectUnauthorized: false 
	};

	var callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	  	var woocommerce_results = JSON.parse(str).products;

	  	var products = [];
	  	var variations = [];
	  	for (var i = woocommerce_results.length - 1; i >= 0; i--) {
	  		if (woocommerce_results[i].variations) {
	  			if (woocommerce_results[i].variations) {
	  				for (var n = captivity_results.length - 1; n >= 0; n--) {
	  					for (var o = woocommerce_results[i].variations.length - 1; o >= 0; o--) {
	  						var woo_stock_quantity = +woocommerce_results[i].variations[o].stock_quantity;
	  						var captivity_stock_quantity = +captivity_results[n].stock_quantity;
	  						if (woo_stock_quantity !== captivity_stock_quantity) 
	  						{
		  						if (captivity_results[n].sku === woocommerce_results[i].variations[o].sku) {
		  							var variation = {
		  								id: woocommerce_results[i].variations[o].id,
		  								stock_quantity: captivity_results[n].stock_quantity
		  							}
		  							variations.push(variation)
		  						}
	  						}
	  					}
	  				}
	  			}
	  		}
	  		if (variations.length) {
				var update = {
					'id': woocommerce_results[i].id,
					'variations': variations
				}
				products.push(update)
				variations = [];
			}
	  	}

	  	var results = {
	  		'products': products
	  	}
	    result.json(results);
	  });
	}

	http.request(options, callback).end();
}