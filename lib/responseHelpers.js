function setStatusRenderError(res, statusCode, message) {
        // response with error
        res.status(statusCode500);
        res.render('error', {
           message
        });
}

module.exports = {
    setStatusRenderError
};
