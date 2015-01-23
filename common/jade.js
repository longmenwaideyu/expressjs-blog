var jade = require('jade');
/**
 * 为了自动的让所有的view数据都带上配置信息
 * Render a Jade file at the given `path`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function|undefined} fn
 * @returns {String}
 * @api public
 */
module.exports = function(path, options, fn){
    var viewConfig = JSON.parse(JSON.stringify(config));
    options.config = options.config || {};
    for (var i in options.config) {
        viewConfig[i] = options.config[i];
    }
    options.config = viewConfig;
    jade.renderFile(path, options, fn);
}