import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface MetadataValue {
  label: string;
  order: number;
  hide: boolean;
  value: string;
}

export interface CertMetadata {
  name: MetadataValue;
  major: MetadataValue;
  date: MetadataValue;
  did: MetadataValue;
  issuer: string;
}

export async function getPdfMetadata(pdfContent: Buffer) {

  const loadingTask = await getDocument(pdfContent).promise;

  console.log("PDF loaded");

  const info = await loadingTask.getMetadata();
  console.log(info);
  const { metadata, issuer } = info.info.Custom;

  return {
    ...JSON.parse(metadata),
    issuer: JSON.parse(issuer).name,
  } as CertMetadata;
}
