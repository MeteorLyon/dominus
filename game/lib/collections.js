Dailystats = new Mongo.Collection('dailystats');
Gamestats = new Mongo.Collection('gamestats');
Reports = new Mongo.Collection('reports');

if (Meteor.isServer) {
	Dailystats.allow({insert: false, update: false, remove: false});
	Meteor.users.allow({insert: false, update: false, remove: false});
	Gamestats.allow({insert: false, update: false, remove: false});
	Reports.allow({insert: false, update: false, remove: false});
}

Meteor.startup(function() {
	Profiles = new Mongo.Collection('profiles', {connection:landingConnection});
	Prefs = new Mongo.Collection('prefs', {connection:landingConnection});
});

// // //log every find
// Meteor.startup(function () {
// 	var wrappedFind = Meteor.Collection.prototype.find;

// 	console.log('[startup] wrapping Collection.find')

// 	Meteor.Collection.prototype.find = function () {
// 		console.log(this._name + '.find', JSON.stringify(arguments))
// 		return wrappedFind.apply(this, arguments);
// 	}
// })

// Meteor.startup(function () {
// 	var wrappedFindOne = Meteor.Collection.prototype.findOne;

// 	console.log('[startup] wrapping Collection.findOne')

// 	Meteor.Collection.prototype.findOne = function () {
// 		console.log(this._name + '.findOne', JSON.stringify(arguments))
// 		return wrappedFindOne.apply(this, arguments);
// 	}
// })

// // log every update
// Meteor.startup(function () {
// 	var wrappedUpdate = Meteor.Collection.prototype.update;

// 	console.log('[startup] wrapping Collection.update')

// 	Meteor.Collection.prototype.update = function () {
// 	  console.log(this._name + '.update', JSON.stringify(arguments))
// 	  return wrappedUpdate.apply(this, arguments);
// 	}
// })
