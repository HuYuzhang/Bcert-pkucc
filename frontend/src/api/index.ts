const API_ROOT = "http://127.0.0.1:9000";

export const uploadCertPath = API_ROOT + "/upload";

export const downloadCertPath = (hash: string) => "http://127.0.0.1:8080/ipfs/" + hash;
