import { React } from '@collboard/modules-sdk';

export function useAsyncMemo<T>(
    factory: () => Promise<T> | undefined | null,
    deps: React.DependencyList,
): T | undefined;
export function useAsyncMemo<T>(
    factory: () => Promise<T> | undefined | null,
    deps: React.DependencyList,
    initial: T,
): T;
export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: React.DependencyList, initial?: T) {
    const [val, setVal] = React.useState<T | undefined>(initial);
    React.useEffect(() => {
        let cancel = false;
        const promise = factory();
        if (promise === undefined || promise === null) return;
        promise.then((val2) => {
            if (!cancel) {
                setVal(val2);
            }
        });
        return () => {
            cancel = true;
        };
    }, deps);
    return val;
}

/**
 * Note: Hook must used React instance exported from @collboard/modules-sdk
 *       So this is a copy of @see https://github.com/awmleer/use-async-memo/blob/master/src/index.ts
 */
