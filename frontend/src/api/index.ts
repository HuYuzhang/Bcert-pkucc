const API_ROOT = process.env.REACT_APP_API_ROOT || "http://127.0.0.1:3000";
const IPFS_ROOT = process.env.REACT_APP_IPFS_ROOT || "https://ipfs.io/ipfs";

export const uploadCertPath = API_ROOT + "/upload";

export const uploadInfoPath = API_ROOT + "/users";

export const getUserInfoPath = (did: string) => API_ROOT + "/users/" + did;

export const ipfsDownloadPath = (hash: string) => IPFS_ROOT + "/" + hash;
