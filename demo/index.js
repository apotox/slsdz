module.exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: `Hello World.  ${new Date()}`,
    };
};
