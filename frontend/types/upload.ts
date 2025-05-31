// upload.ts
export interface UserUploadRequest {
  name: string;
  image: File | null;
  country: string;
  email: string;
  external_link: string;
}

export interface BusinessUploadRequest {
  name: string;
  about: string;
  email: string;
  country: string;
  external_link: string;
  image: File | null;
}

export interface InvoiceUploadRequest {
  title: string;
  description: string;
  invoice: File | null;
}
