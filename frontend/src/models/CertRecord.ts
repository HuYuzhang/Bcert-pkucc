import { getPdfMetadata } from "src/utils/pdf";

export class CertRecord {
  did: string;
  name: string;
  date: string;
  major: string;
  issuer: string;
  hash: string;

  constructor(did: string, name: string, date: string,
    major: string, issuer: string, hash: string) {
    this.did = did;
    this.name = name;
    this.date= date;
    this.major = major;
    this.issuer = issuer;
    this.hash = hash;
  }

  fileName() {
    return `${this.major}-${this.issuer}-${this.date}`;
  }

  equals(other: CertRecord) {
    return this.hash === other.hash;
  }

  static async fromPdfContent(pdfContent: Buffer, hash: string) {
    const { did, issuer, name, major, date } = await getPdfMetadata(pdfContent);
    return new CertRecord(
      did.value,
      name.value,
      date.value,
      major.value,
      issuer,
      hash,
    );
  }

}

