export function getFirstPhotoUrl(L_Photos) {
  if (!L_Photos) return "";

  try {
    //Parse photo 
    const parsed = typeof L_Photos === "string" ? JSON.parse(L_Photos) : L_Photos;

    if (!Array.isArray(parsed) || parsed.length === 0) return "";
    //First photo 
    const first = parsed.find((item) => {
      if (typeof item !== "string") return false;
      return item.includes("PHOTO-Jpeg") || item.includes("PHOTO") 
      || item.includes(".jpg") || item.includes(".jpeg");
    });

    if (typeof first === "string") return first;

    if (first && typeof first === "object") {
      return first.url || first.href || first.photoUrl || "";
    }

    return "";
  } catch {
    return "";
  }
}