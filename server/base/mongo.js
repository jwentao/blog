/**
 * mongoose操作类(封装mongodb)
 */

let fs = require('fs');
let path = require('path');
let mongoose = require('mongoose');
let logger = require('pomelo-logger').getLogger('mongodb-log');

let options = {
	db_user: "",
	db_pwd: "",
	db_host: "localhost",
	db_port: 27017,
	db_name: "test1"
};

let dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
dbURL = 'mongodb://localhost:27017/test1'
mongoose.connect(dbURL);

mongoose.connection.on('connected', function (err) {
	console.log('connected')
	if (err) logger.error('Database connection failure');
});

mongoose.connection.on('error', function (err) {
	logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function () {
	logger.error('Mongoose disconnected');
});

process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		logger.info('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

let DB = function () {
	this.mongoClient = {};
	let filename = path.join(path.dirname(__dirname), 'base/config/table.json');
	this.tabConf = JSON.parse(fs.readFileSync(path.normalize(filename)));
};

/**
 * 初始化mongoose model
 * @param table_name 表名称(集合名称)
 */
DB.prototype.getConnection = function (table_name) {
	if (!table_name) return;
	if (!this.tabConf[table_name]) {
		logger.error('No table structure');
		return false;
	}

	let client = this.mongoClient[table_name];
	if (!client) {
		//构建用户信息表结构
		let nodeSchema = new mongoose.Schema(this.tabConf[table_name]);

		//构建model
		client = mongoose.model(table_name, nodeSchema, table_name);

		this.mongoClient[table_name] = client;
	}
	return client;
};

/**
 * 保存数据
 * @param table_name 表名
 * @param fields 表数据
 * @param callback 回调方法
 */
DB.prototype.save = function (table_name, fields, callback) {
	if (!fields) {
		if (callback) callback({msg: 'Field is not allowed for null'});
		return false;
	}

	let err_num = 0;
	for (let i in fields) {
		if (!this.tabConf[table_name][i]) err_num ++;
	}
	if (err_num > 0) {
		if (callback) callback({msg: 'Wrong field name'});
		return false;
	}

	let node_model = this.getConnection(table_name);
	let mongooseEntity = new node_model(fields);
	mongooseEntity.save(function (err, res) {
		if (err) {
			if (callback) callback(err);
		} else {
			if (callback) callback(null, res);
		}
	});
};

/**
 * 更新数据
 * @param table_name 表名
 * @param conditions 更新需要的条件 {_id: id, user_name: name}
 * @param update_fields 要更新的字段 {age: 21, sex: 1}
 * @param callback 回调方法
 */
DB.prototype.update = function (table_name, conditions, update_fields, callback) {
	if (!update_fields || !conditions) {
		if (callback) callback({msg: 'Parameter error'});
		return;
	}
	let node_model = this.getConnection(table_name);
	node_model.update(conditions, {$set: update_fields}, {multi: true, upsert: true}, function (err, res) {
		if (err) {
			if (callback) callback(err);
		} else {
			if (callback) callback(null, res);
		}
	});
};

/**
 * 更新数据方法(带操作符的)
 * @param table_name 数据表名
 * @param conditions 更新条件 {_id: id, user_name: name}
 * @param update_fields 更新的操作符 {$set: {id: 123}}
 * @param callback 回调方法
 */
DB.prototype.updateData = function (table_name, conditions, update_fields, callback) {
	if (!update_fields || !conditions) {
		if (callback) callback({msg: 'Parameter error'});
		return;
	}
	let node_model = this.getConnection(table_name);
	node_model.findOneAndUpdate(conditions, update_fields, {multi: true, upsert: true}, function (err, data) {
		if (callback) callback(err, data);
	});
};

/**
 * 删除数据
 * @param table_name 表名
 * @param conditions 删除需要的条件 {_id: id}
 * @param callback 回调方法
 */
DB.prototype.remove = function (table_name, conditions, callback) {
	let node_model = this.getConnection(table_name);
	node_model.remove(conditions, function (err, res) {
		if (err) {
			if (callback) callback(err);
		} else {
			if (callback) callback(null, res);
		}
	});
};

/**
 * 查询数据
 * @param table_name 表名
 * @param conditions 查询条件
 * @param fields 待返回字段
 * @oaram option 限制条件
 * @param callback 回调方法
 */
DB.prototype.find = function (table_name, conditions, fields, option, callback) {
	let node_model = this.getConnection(table_name);
	// fields = {}
	let count
	node_model.count(conditions, function (err, res) {
		if (!err) {
			count = res
		}
	})
	node_model.find(conditions, fields || null, option, function (err, res) {
		if (err) {
			callback(err);
		} else {
			callback(null, {
				total: count,
				data: res
			});
		}
	});
};

/**
 * 查询单条数据
 * @param table_name 表名
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.findOne = function (table_name, conditions, callback) {
	let node_model = this.getConnection(table_name);
	node_model.findOne(conditions, function (err, res) {
		if (err) {
			callback(err);
		} else {
			callback(null, res);
		}
	});
};

/**
 * 根据_id查询指定的数据
 * @param table_name 表名
 * @param _id 可以是字符串或 ObjectId 对象。
 * @param callback 回调方法
 */
DB.prototype.findById = function (table_name, _id, callback) {
	let node_model = this.getConnection(table_name);
	node_model.findById(_id, function (err, res){
		if (err) {
			callback(err);
		} else {
			callback(null, res);
		}
	});
};

/**
 * 返回符合条件的文档数
 * @param table_name 表名
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.count = function (table_name, conditions, callback) {
	let node_model = this.getConnection(table_name);
	node_model.count(conditions, function (err, res) {
		if (err) {
			callback(err);
		} else {
			callback(null, res);
		}
	});
};

/**
 * 查询符合条件的文档并返回根据键分组的结果
 * @param table_name 表名
 * @param field 待返回的键值
 * @param conditions 查询条件
 * @param callback 回调方法
 */
DB.prototype.distinct = function (table_name, field, conditions, callback) {
	let node_model = this.getConnection(table_name);
	node_model.distinct(field, conditions, function (err, res) {
		if (err) {
			callback(err);
		} else {
			callback(null, res);
		}
	});
};

/**
 * 连写查询
 * @param table_name 表名
 * @param conditions 查询条件 {a:1, b:2}
 * @param options 选项：{fields: "a b c", sort: {time: -1}, limit: 10}
 * @param callback 回调方法
 */
DB.prototype.where = function (table_name, conditions, options, callback) {
	let node_model = this.getConnection(table_name);
	node_model.find(conditions)
		.select(options.fields || '')
		.sort(options.sort || {})
		.limit(options.limit || {})
		.exec(function (err, res) {
			if (err) {
				callback(err);
			} else {
				callback(null, res);
			}
		});
};

module.exports = new DB();