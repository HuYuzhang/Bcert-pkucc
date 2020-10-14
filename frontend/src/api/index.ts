const API_ROOT = "http://127.0.0.1:3000";
const ipfsRoot = "https://ipfs.io/ipfs";

export const uploadCertPath = API_ROOT + "/upload";

export const ipfsDownloadPath = (hash: string) => ipfsRoot + "/" + hash;
