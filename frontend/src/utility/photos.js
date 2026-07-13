// export function getFirstPhotoUrl(L_Photos) {
//   if (!L_Photos) return "";

//   try {
//     //Parse photo 
//     const parsed = typeof L_Photos === "string" ? JSON.parse(L_Photos) : L_Photos;

//     if (!Array.isArray(parsed) || parsed.length === 0) return "";
//     //First photo 
//     const first = parsed.find((item) => {
//       if (typeof item !== "string") return false;
//       return (
//               item.includes("PHOTO-Jpeg") || 
//               item.includes("PHOTO") || 
//               item.includes(".jpg") || 
//               item.includes(".jpeg"));
//     });
//     console.log("first", first);
//     if (typeof first === "string") return first;

//     if (first && typeof first === "object") {
//       return first.url || first.href || first.photoUrl || "";
//     }

//     return "";
//   } catch {
//     return "";
//   }
// }

export function getPhotoUrls(L_Photos) {
  if (!L_Photos) return [];

  try {
    const parsed = typeof L_Photos === "string" ? JSON.parse(L_Photos) : L_Photos;

    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    return parsed.filter((item) => {
      if (typeof item === "string" && /^https?:\/\//i.test(item.trim())) {
        return (
          item.includes("PHOTO-Jpeg") ||
          item.includes("PHOTO") ||
          item.includes(".jpg") ||
          item.includes(".jpeg")
        );
      }

      if (typeof item === "object" && item !== null) {
        return item.url || item.href || item.photoUrl;
      }

      return false;
    }).map((item) => {
      if (typeof item === "string") return item;
      return item.url || item.href || item.photoUrl;
    });

  } catch {
    return [];
  }
}

export function getFirstPhotoUrl(L_Photos) {
  const photos = getPhotoUrls(L_Photos);
  console.log("First photo:", photos.length > 0 ? photos[0] : "");
  return photos.length > 0 ? photos[0] : "";
}