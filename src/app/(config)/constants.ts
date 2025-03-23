const errorIfVariableDoesNotExist = (envVarName: string) => {
    if (
        !process.env[envVarName] ||
        process.env[envVarName] === ""
    ) {
        throw new Error(`${[envVarName]} is not set`);
    }
    return process.env[envVarName];
};

export const GOOGLE_OAUTH_CLIENT_ID = errorIfVariableDoesNotExist("GOOGLE_OAUTH_CLIENT_ID");
export const GOOGLE_OAUTH_CLIENT_SECRET = errorIfVariableDoesNotExist("GOOGLE_OAUTH_CLIENT_SECRET");
