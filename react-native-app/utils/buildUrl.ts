export const BASE_PHANTOM_URL = "https://phantom.app/ul/v1/";

export const buildUrl = (path: string, params: URLSearchParams) => `${BASE_PHANTOM_URL}${path}?${params.toString()}`; 