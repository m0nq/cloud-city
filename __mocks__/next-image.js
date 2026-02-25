const React = require("react");

function MockNextImage({
    priority,
    placeholder,
    blurDataURL,
    unoptimized,
    loader,
    fill,
    ...props
}) {
    return React.createElement("img", props);
}

module.exports = MockNextImage;
module.exports.default = MockNextImage;
module.exports.__esModule = true;
