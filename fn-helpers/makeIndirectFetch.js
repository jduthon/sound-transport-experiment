export const makeIndirectFetch = fetchFn => (...args) => () => fetchFn(...args);
