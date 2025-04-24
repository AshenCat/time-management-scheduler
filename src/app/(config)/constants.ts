const errorIfENVDoesNotExist = (envVarName: string) => {
    if (
        !process.env[envVarName] ||
        process.env[envVarName] === ""
    ) {
        throw new Error(`${[envVarName]} is not set`);
    }
    return process.env[envVarName];
};

export const GOOGLE_OAUTH_CLIENT_ID = errorIfENVDoesNotExist("GOOGLE_OAUTH_CLIENT_ID");
export const GOOGLE_OAUTH_CLIENT_SECRET = errorIfENVDoesNotExist("GOOGLE_OAUTH_CLIENT_SECRET");
export const MONGODB_URI = errorIfENVDoesNotExist("MONGODB_URI");
export const NODE_ENV = errorIfENVDoesNotExist("NODE_ENV");
