/**
 * 接口公共方法
 * @author: liuchuanyang
 * @date: 2017/3/16
 */

'use strict';
const rp = require('request-promise');
const qs = require('querystring');
const md5 = require('md5');
const _ = require('lodash');
// const log = require('./logger');
// const sign = require('./sign');
const log4js = require('log4js');
const log = log4js.getLogger();
const Timer = require('./timer');
// const memoryCache = require('memory-cache');
const Promise = require('bluebird');
const co = Promise.coroutine;
const URL = require('url');
const crypto = require('crypto');
const zlib = require('zlib');


// 错误返回
const API_BAD_RETSULT = {
    code: 500,
    message: '请稍后重试'
};

// 调用失败
const API_CALL_FAIL = {
    code: 500,
    message: '请稍后重试'
};

// all 方法错误的传参
const API_ALL_METHOD_ERROR = 'the parameters of api all method should be Array!';

// 获取缓存数据失败
const SLAVE_CACHE_FAIL = 'get slave cache fail';
const MASTER_CACHE_FAIL = 'get master cache fail';

// 获取缓存数据成功
const SLAVE_CACHE_SUCCESS = 'get slave cache success';
const MASTER_CACHE_SUCCESS = 'get master cache success';

const INTERFACE_SHUT_KEY = "INTERFACE_SHUT_KEY";

function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

class Http {

    /**
     * 构造器
     * @param baseUrl
     * @param options
     */
    constructor(baseUrl, options) {
        this.ApiUrl = baseUrl;
        this.cache = options.cache;
        this.useCache = options.useCache;
        this.name = options.name;
        this.timeout = options.timeout;
        // this.interfaceShunt = options.interfaceShunt || {};
    }

    /**
     * 获取请求 ID
     *
     * @param {Object} options 请求传参
     */
    /*_getReqId(options) {
        let data = options.qs || options.form;
        let prefix = data.method || options.url;
        return prefix + ':' + md5(`${options.url}?${qs.stringify(options.qs || options.form)}`);
    }*/

    /**
     * 处理接口返回状态码
     *
     * @param  {Object} data 默认返回参数
     * @param  {[type]} code 返回编码
     * @param  {[type]} url  接口地址
     * @return {Object}      返回处理后的数据
     */
    _handleDataCode(data, code, url) {
        let result = {};

        code = code || 200;
        if (_.toNumber(data.code) === _.toNumber(code)) {
            return data;
        } else {
            log.error(`API: ${url} response data code not equal ${code}`);
        }
        return result;
    }

    _toString(options) {
        let _date = options.body || {}; //options.qs || options.form || {};
        return ` ${_.toUpper(options.method || 'get')} ${options.url}?${JSON.stringify(_date)}`;
    }

    /**
     * 调用接口
     *
     * @param  {Object} options 请求参数
     * @param  {Object} param   默认返回值
     * @param  {String} reqId   请求唯一hash值
     * @return {Promise}        请求Promise对象
     */
    _requestFromAPI(options, param, reqId) {
        const timer = new Timer();
        const method = options.method || 'get';
        let _url = URL.parse(options.url);
        let _date = options.qs || options.form || {};

        // options.forever = true;
        timer.put('getApi');// 统计时间开始
        return rp(options).then((result) => {
            const duration = timer.put('getApi');// 统计时间结束

            log.info(`api success [${duration}ms]`, this._toString(options));

            // 数据校验
            if (!result) {
                log.error(`BAD RESULT: ${result} `, this._toString(options));
                return Promise.resolve(API_BAD_RETSULT);
            } else if (result && (result.code === 9999991 || result.code === 9999992)) {
                log.warn(`api call limited. `, this._toString(options));
                return Promise.resolve({});
            }

            // 处理返回数据状态码
            if (param && param.code) {
                result = this._handleDataCode(result, param.code, `${options.url}?${qs.stringify(_date)}`);
            }

            // 写缓存, 否则返回 Slave 缓存服务器的数据
            /*if (this.useCache && this.cache && method === 'get' && param && param.cache) {
                if (result && !_.isEmpty(result)) {
                    const cacheTime = _.isNumber(param.cache) ? param.cache : 60;
                    const catchErr = (err) => {
                        log.error(`cache: ${err.toString()}`, this._toString(options));
                    };

                    reqId = reqId || this._getReqId(options);

                    this.cache.set(`apiCache:${reqId}`, result, cacheTime).catch(catchErr);
                    this.cache.setSlave(`apiCache2:${reqId}`, result, 86400).catch(catchErr); // 二级缓存存储一天

                } else {
                    return this._requestFromCache(options, true, param, reqId);
                }
            }

            if (this.useCache && method === 'get' && param && param.memCache) {
                memoryCache.put(reqId, result, (_.isNumber(param.memCache) ? param.memCache : 60) * 1000);
            }*/

            return result || {};
        }).catch((err) => {
            const duration = timer.put('getApi');// 统计时间结束

            log.error(`api fail [${duration}ms] ${this._toString(options)}`, `code:${err.statusCode}, error: ${err.message}`);

            // 使用缓存的时候，读取二级缓存
            /*if (this.useCache && this.cache && param && param.cache) {
                return this._requestFromCache(options, true, param, reqId);
            }*/
            return Promise.resolve(API_CALL_FAIL);
        });
    }

    /**
     * 读取缓存
     * @param  {Object} options
     * @param  {Boolean} slave true： 读取二级缓存
     * @param  {Object} param 请求API处理参数
     * @return {Promise}
     */
    /*_requestFromCache(options, slave, param, reqId) {
        log.info(`get ${slave ? 'slave' : 'master'} cache: ${reqId}`, this._toString(options));

        let getFromCache = slave ? this.cache.getFromSlave : this.cache.get;
        let getFromCacheKey = slave ? `apiCache2:${reqId}` : `apiCache:${reqId}`;

        return getFromCache.call(this.cache, getFromCacheKey).then((result) => {
            if (result && !_.isNil(result)) {

                log.info(slave ? SLAVE_CACHE_SUCCESS : MASTER_CACHE_SUCCESS);
                return parseJson(result);
            }

            // 读取master失败，调用 API
            if (!slave) {
                return this._requestFromAPI(options, param, reqId);
            }
        }).catch((e) => {
            log.error(slave ? SLAVE_CACHE_FAIL : MASTER_CACHE_FAIL, this._toString(options));
            log.error(e);

            // 读取master失败，调用 API
            if (!slave) {
                return this._requestFromAPI(options, param, reqId);
            }

            return Promise.resolve(API_CALL_FAIL);
        });
    }*/

    /**
     * 根据配置决定请求Java接口的地址
     * @param  {[object]} param 数据处理参数
     * @return {[string]} url
     */
    /*_getUrl(param) {
        param = param || {};

        let url = null,
            uid = param.uid || 0,
            mod = 0;
        let _this = this;

        return co(function*() {
            let config = yield _this._getShutConfigFromCache();
            let cloud = config.cloud;
            let ips;

            switch (cloud) {
                case 1:    // aws
                    ips = config.aws || {};
                    break;
                case 2:    // tencent
                    ips = config.tencent || {};
                    break;
                case 3:    // aws + tencent
                    let strategy = config.strategy;
                    if (uid && strategy.model) {
                        mod = uid % strategy.model;
                        ips = mod > (strategy.tencentMax || 0) ? config.aws : config.tencent;
                    } else if (strategy.notLogin) {
                        ips = config[strategy.notLogin];
                    }
                    break;
                default:
                    ips = {};
                    break;
            }

            if (ips && _this.name) {
                ips = ips[`${_this.name}.xxx.cn`];
            }

            if (ips && ips.length > 0) {
                return 'http://' + ips[Math.floor(Math.random() * ips.length)].ip;
            }
            return url;
        })();
    }*/

    /**
     * 从缓存中读取配置, 优先本地缓存(30s) --> memcached (60s) --> 调用接口
     * @private
     */
    /*_getShutConfigFromCache() {
        let _this = this;

        return co(function *() {
            let config = memoryCache.get(INTERFACE_SHUT_KEY);

            // log.debug('get shut config from memory cache, ' + JSON.stringify(config));

            if (!config) {
                try {
                    config = yield _this.cache.get(INTERFACE_SHUT_KEY);
                    if (config) {
                        config = parseJson(config);
                    }
                } catch (e) {
                    log.error('read shut config from memecached error.', e);
                }

                // log.debug('get shut config from memcached, ' + config);

                if (!config) {
                    config = yield _this._getShutConfigFromRemote();
                }
            }

            return config || {};
        })().catch(err => {
            log.error('read shut config from memecached error.', e);
        });
    }*/

    /**
     * 调用接口获取ip直连配置。 读取成功后写入缓存
     * @returns {Promise.<T>}
     * @private
     */
    /*_getShutConfigFromRemote() {
        let _this = this;
        return rp({
            url: _this.interfaceShunt.url,
            timeout: 1000
        }).then(result => {
            console.log(shutDecode(result));
            result = parseJson(shutDecode(result));
            if (result) {
                // 写入缓存
                memoryCache.put(INTERFACE_SHUT_KEY, result, _this.interfaceShunt.memoryTimeout || 30000, function(key) {
                    if (key === INTERFACE_SHUT_KEY) {
                        _this._getShutConfigFromRemote();
                    }
                });
                // 写入本地缓存
                _this.cache.set(INTERFACE_SHUT_KEY, result, (_this.interfaceShunt.memcachedTimeout / 1000) || 60).catch((err) => {
                    log.error(`write master cache fail. key = ${INTERFACE_SHUT_KEY}`, err);
                });
            }
            log.info('get shut config from remote ', result);
            return result;
        }).catch(err => {
            log.error(`call interface shut config fail`, err);

            return {};
        });
    }*/


    /**
     * 使用 get 请求获取接口
     * @param  {[string]} url
     * @param  {[object]} data
     * @param  {[object]} param 数据处理参数
     * @param  {[string]} host 服务器对应的host设置
     * @return {[type]}
     */
    _get(url, data, param, host) {
        const options = {
            url: url,
            qs: data,   // data.client_secret ? data : sign.apiSign(data),
            json: true,
            timeout: this.timeout || 3000,
            gzip: true
        };

        let cache = false;

        if (host) {
            options.headers = {
                'Host': host
            }
        }

        if (host) {
            options.headers = {
                'Host': host
            }
        }

        if (param && param.headers) {
            options.headers = _.defaults(options.headers, param.headers);
        }

        // const reqId = this._getReqId(options);

        if (typeof param === 'boolean') {
            cache = param;
            param = {};
        } else if (typeof param === 'object') {
            cache = param.cache;
            options.timeout = param.timeout || options.timeout;
        } else {
            param = {};
        }
    
        /*if (this.useCache && param.memCache) {
            let result = memoryCache.get(reqId);

            if (result) {
                log.info(`get success from memory cache. ${reqId}`);
                return Promise.resolve(result);
            }
        }

        // 从缓存获取数据
        if (this.useCache && this.cache && cache) {
            return this._requestFromCache(options, false, param, reqId);
        }*/
        return this._requestFromAPI(options, param);
    }

    /**
     * 使用 post 请求获取接口
     * @param  {[string]} url
     * @param  {[object]} data
     * @param  {[object]} param 数据处理参数
     * @param  {[string]} host 服务器对应的host设置
     * @return {[type]}
     */
    _post(url, data, param, host) {
        const options = {
            url: url,
            // form: data,  // data.client_secret ? data : sign.apiSign(data),
            body: data,
            method: 'post',
            json: true,
            timeout: this.timeout || 3000,
            gzip: true
        };

        if (param) {
            options.timeout = param.timeout || options.timeout;
        }

        if (host) {
            options.headers = {
                'Host': host
            }
        }

        if (param && param.headers) {
            options.headers = _.defaults(options.headers, param.headers);
        }
        
        return this._requestFromAPI(options, param);
    }

    /**
     * 使用 get 请求获取接口
     * @param  {[string]} url
     * @param  {[object]} data
     * @param  {[object]} param 数据处理参数
     * @return {Promise}
     */
    get(url, data, param) {
        let host = null;
        let _this = this;

        return co(function*() {
            /*if (data && data.uid) {
                try {
                    yield _this._wrapSessionKey(data);
                } finally {}
            }*/

            /*if (_this.interfaceShunt.open) {
                let serverUrl = yield _this._getUrl(data);
                host = `${_this.name}.xxx.cn`;

                if (serverUrl) {
                    return _this._get(URL.resolve(serverUrl, url), data, param, host).catch(err => {
                        log.warn(`shut call get api ${serverUrl} fail`, err);
                        return _this._get(URL.resolve(_this.ApiUrl, url), data, param);
                    });
                }
            }*/
            return _this._get(URL.resolve(_this.ApiUrl, url), data, param);
        })();
    }

    /**
     * 使用 post 请求获取接口
     * @param  {[string]} url
     * @param  {[object]} data
     * @param  {[object]} param 数据处理参数
     * @return {Promise}
     */
    post(url, data, param) {
        let host = null;
        let _this = this;

        return co(function*() {
            /*if (data && data.uid) {
                try {
                    yield _this._wrapSessionKey(data);
                } finally {}
            }

            if (_this.interfaceShunt.open) {
                let serverUrl = yield _this._getUrl(data);
                host = `${_this.name}.xxx.cn`;


                if (serverUrl) {
                    return _this._post(URL.resolve(serverUrl, url), data, param, host).catch(() => {
                        log.warn(`shut call post api ${serverUrl} fail`);
                        return _this._post(URL.resolve(_this.ApiUrl, url), data, param);
                    });
                }
            }*/
            return _this._post(URL.resolve(_this.ApiUrl, url), data, param);
        })();
    }

    /*_wrapSessionKey(data) {
        if (data && data.uid) {
            let key = `java_session_key:${data.uid}`;

            return this.cache.get(key).then(session_key => {
                if (session_key) {
                    data.session_key = session_key;
                }
            }).catch((e) => {
                log.error('get session_key fail. ', key);
                delete data.session_key;
            });
        }
    }*/

    /**
     * 批量并行调用接口
     *
     * @param  {List} list 接口调用列表
     * @return {Promise}   promise
     */
    all(list) {
        if (_.isArray(list)) {
            return Promise.all(list);
        } else {
            return Promise.resolve(Error(API_ALL_METHOD_ERROR));
        }
    }

    /**
     * 使用 post 发送文件接口
     * @param url
     * @param data 普通 json
     * @param files 文件流对象
     * @param param param 数据处理参数
     *
     * example:
     * ```js
     * const my_file = fs.createReadStream(__dirname + 'test.json'),
     *
     * files = {
     *      file_data:my_file
     * }
     *
     * postFile('',{
     *       method: 'app.passport.modifyHead',
     *       uid: uid,
     *       bucket: bucket,
     * },files);
     * ```
     */
    postFile(url, data, files, param) {
        const formData = Object.assign(sign.apiSign(data), files);

        const options = {
            url: `${this.ApiUrl}${url}`,
            formData: formData,
            method: 'post',
            json: true,
            timeout: this.timeout || 3000,
            gzip: true
        };

        return this._requestFromAPI(options, param);
    }
}


module.exports = Http;
