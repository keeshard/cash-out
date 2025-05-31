import {
  BusinessUploadRequest,
  UserUploadRequest,
  InvoiceUploadRequest,
} from "@/types/upload";

export async function uploadUserProfile(user: UserUploadRequest): Promise<{
  success: boolean;
  data?: { metadataUrl: string; pfpUrl: string };
  error?: string;
}> {
  try {
    let pfpUrl;
    if (user.image) {
      const formData = new FormData();
      formData.append("file", user.image);
      const response = await fetch("/api/pinata/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      pfpUrl = data.url;
    }
    const metadataRequest = await fetch("/api/pinata/json", {
      method: "POST",
      body: JSON.stringify({
        json: {
          name: user.name,
          email: user.email,
          country: user.country,
          external_link: user.external_link,
          image: pfpUrl,
        },
      }),
    });
    const { url: metadataUrl } = await metadataRequest.json();
    return {
      success: true,
      data: {
        pfpUrl,
        metadataUrl,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to upload user profile",
    };
  }
}

export async function uploadBusinessProfile(
  business: BusinessUploadRequest
): Promise<{
  success: boolean;
  data?: { metadataUrl: string; logoUrl: string };
  error?: string;
}> {
  try {
    let logoUrl, coverImageUrl;
    if (business.image) {
      const formData = new FormData();
      formData.append("file", business.image);
      const response = await fetch("/api/pinata/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      logoUrl = data.url;
    }
    const metadataRequest = await fetch("/api/pinata/json", {
      method: "POST",
      body: JSON.stringify({
        json: {
          name: business.name,
          about: business.about,
          email: business.email,
          country: business.country,
          external_link: business.external_link,
          logo: logoUrl,
        },
      }),
    });
    const { url: metadataUrl } = await metadataRequest.json();
    return {
      success: true,
      data: {
        logoUrl,
        metadataUrl,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to upload business profile",
    };
  }
}

export async function uploadInvoiceData(
  invoiceData: InvoiceUploadRequest
): Promise<{
  success: boolean;
  data?: { metadataUrl: string; invoiceUrl: string };
  error?: string;
}> {
  try {
    let invoiceUrl;
    if (invoiceData.invoice) {
      const formData = new FormData();
      formData.append("file", invoiceData.invoice);
      const res = await fetch("/api/pinata/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      invoiceUrl = data.url;
    }
    const metadataRequest = await fetch("/api/pinata/json", {
      method: "POST",
      body: JSON.stringify({
        json: {
          title: invoiceData.title,
          description: invoiceData.description,
          invoice: invoiceUrl,
        },
      }),
    });
    const { url: metadataUrl } = await metadataRequest.json();

    return {
      success: true,
      data: {
        metadataUrl,
        invoiceUrl,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "Failed to upload invoice data",
    };
  }
}
