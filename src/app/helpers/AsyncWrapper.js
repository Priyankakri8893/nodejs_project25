const { errorHandler } = require("./errorHandling.helper");

class AsyncWrapper {
    constructor() { }

    wrapAsync(fn) {
        return async (req, res) => {
            try {
                const result = await fn(req, res);
                return res.status(200).send(result);
            } catch (err) {
                console.log("Error", err);
                const response = errorHandler(err);
                return res.status(response.status).send(response);
            }
        };
    }
}

module.exports = new AsyncWrapper();
