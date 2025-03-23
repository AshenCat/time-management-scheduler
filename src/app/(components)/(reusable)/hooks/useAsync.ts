import { DependencyList, useCallback, useEffect, useState } from "react";

export default function useAsync(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    callback: Function,
    dependencies: DependencyList = []
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | undefined>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [value, setValue] = useState<any>();

    const callbackMemoized = useCallback(() => {
        setLoading(true);
        setError(undefined);
        setValue(undefined);
        callback()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    useEffect(() => {
        callbackMemoized();
    }, [callbackMemoized]);

    return [loading, error, value];
}
