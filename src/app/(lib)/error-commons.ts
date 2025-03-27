export const printError = (param: string, err: Error) => {
    console.error(`Error: ${param}`);
    console.error(err);
};

export const abstractedPrintError = () => {
    console.error("Error: Something went wrong");
    return "Error: Something went wrong";
};
