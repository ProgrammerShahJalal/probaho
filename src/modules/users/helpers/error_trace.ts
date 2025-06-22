async function error_trace(
    models: any,
    error: any,
    url: any,
    params: any,
): Promise<string> {
    function generateUID() {
        const timestamp = new Date().getTime();
        const randomPart = Math.floor(Math.random() * 10000);
        return `${timestamp}00${randomPart}`;
    }
    let uid: string = generateUID();

    try {
        await models.sequelize.query(
            `INSERT INTO error_traces (title, details, uid, url, params) VALUES (${JSON.stringify(error.message)}, '${JSON.stringify(error.stack)}', '${uid}', '${url}', '${JSON.stringify(params)}')`,
        );
    } catch (error) {
        console.error('Error executing manual query:', error);
    }

    return uid;
}

export default error_trace;
