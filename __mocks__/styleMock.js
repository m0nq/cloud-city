const styles = new Proxy(
    {},
    {
        get: (_target, prop) => String(prop),
    },
);

module.exports = styles;
module.exports.default = styles;
module.exports.__esModule = true;
