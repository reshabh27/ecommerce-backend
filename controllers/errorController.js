

const devErrors = (res, err) => {
    // console.log("here i come");
    res.status(err.statusCode).send({
        status: err.statusCode,
        message: err.message,
        stackTrace: err.stack,
        error: err,
    });
};

const castErrorHandler = (err) => {
    return new customError(
        `Invalid value ${err.value} of field ${err.path}`,
        404
    );
};
const duplicateKeyHandler = (err) => {
    return new customError(
        `The user with name ${err.keyValue.name} is already present`,
        400
    );
};
const tokenExpiredHandler = (err) => {
    return new customError("The token has been expired, please login", 401);
};
const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const errorMessages = errors.join(". ");
    return new customError(`Invalid input data:${errorMessages}`, 400);
};

const prodErrors = (res, err) => {
    if (err.isOperational) {
        res.status(500).json({
            status: err.statusCode,
            message: err.message,
        });
    } else {
        res.status(err.statusCode).json({
            status: "error",
            message: "Some error occured, please try after sometime",
        });
    }
};



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // if (process.env.NODE_ENV === "development") {
    //     devErrors(res, err);
    // }
    if (process.env.NODE_ENV === "development") {
        devErrors(res, err);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError") {
            err = castErrorHandler(err);
        } else if (err.code === 11000) {
            err = duplicateKeyHandler(err);
        } else if (err.name === "ValidationError") {
            err = validationErrorHandler(err);
        } else if (err.name === "TokenExpiredError") {
            err = tokenExpiredHandler(err);
        }
        prodErrors(res, err);
    }
};