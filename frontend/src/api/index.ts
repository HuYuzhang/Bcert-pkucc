const API_ROOT = process.env.API_ROOT || "http://127.0.0.1:3000";
const ipfsRoot = process.env.IPFS_ROOT || "https://ipfs.io/ipfs";

export const uploadCertPath = API_ROOT + "/upload";

export const ipfsDownloadPath = (hash: string) => ipfsRoot + "/" + hash;
