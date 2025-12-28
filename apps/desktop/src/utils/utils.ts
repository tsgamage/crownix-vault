export function downloadVaultFile(bytes: any, filename = "CrownixVault.cxv") {
  const blob = new Blob([bytes], {
    type: "application/octet-stream",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * This function takes a full URL string as input and returns the main URL (origin) of the site.
 * @param fullUrl Full URL string.
 * @returns Main URL (origin) of the site.
 */
export function getSiteMainUrl(fullUrl: string): string {
  try {
    const urlObject = new URL(fullUrl);
    return urlObject.origin;
  } catch (error) {
    console.error("Invalid URL provided:" + fullUrl, error);
    return "";
  }
}

// export const generatePassword = () => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
//   let pass = "";
//   for (let i = 0; i < 16; i++) {
//     pass += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return pass;
// };
