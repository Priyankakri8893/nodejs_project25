const { errorHandler } = require("./errorHandling.helper");

exports.wrapAsync = fn => {
    return (req, res) => {
        return fn(req, res)
            .then(r => {
                return res.status(200).send(r);
            })
            .catch(err => {
                console.log("Error", err)
                const response = errorHandler(err);
                return res.status(response.status).send(response);
            });
    };
};
