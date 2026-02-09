type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
};

export function getOptimizedCloudinaryUrl(
  sourceUrl: string,
  options: CloudinaryImageOptions = {}
) {
  if (
    !sourceUrl.includes("res.cloudinary.com") ||
    !sourceUrl.includes("/upload/")
  ) {
    return sourceUrl;
  }

  const transformations = [
    "f_auto",
    "dpr_auto",
    `q_auto${options.quality ? `:${options.quality}` : ""}`
  ];

  if (options.width) {
    transformations.push(`w_${options.width}`);
  }

  if (options.height) {
    transformations.push(`h_${options.height}`);
  }

  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  return sourceUrl.replace("/upload/", `/upload/${transformations.join(",")}/`);
}
