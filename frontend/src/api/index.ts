const API_ROOT = "http://127.0.0.1:3000";

export const uploadCertPath = API_ROOT + "/upload";

export const ipfsRoot = "https://ipfs.io" + "/ipfs";

export const downloadCertPath = (hash: string) => ipfsRoot + "/" + hash;
