const API_ROOT = "http://127.0.0.1:3000";

export const uploadCertPath = API_ROOT + "/upload";

export const downloadCertPath = (hash: string) => API_ROOT + "/ipfs/" + hash;
