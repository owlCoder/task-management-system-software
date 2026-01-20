import { AllowedFileExtensions } from "../Domain/enums/AllowedFileExtensions";

export const determineFileType = (
  fileExtension: string,
): "image" | "audio" | "video" | "other" => {
  const ext = fileExtension.toLowerCase();

  const imageExtensions = [
    AllowedFileExtensions.JPG,
    AllowedFileExtensions.JPEG,
    AllowedFileExtensions.PNG,
    AllowedFileExtensions.GIF,
    AllowedFileExtensions.BMP,
    AllowedFileExtensions.WEBP,
    AllowedFileExtensions.SVG,
  ];

  const videoExtensions = [
    AllowedFileExtensions.MP4,
    AllowedFileExtensions.AVI,
    AllowedFileExtensions.MOV,
    AllowedFileExtensions.WMV,
    AllowedFileExtensions.FLV,
    AllowedFileExtensions.WEBM,
    AllowedFileExtensions.MKV,
  ];

  const audioExtensions = [
    AllowedFileExtensions.MP3,
    AllowedFileExtensions.WAV,
    AllowedFileExtensions.FLAC,
    AllowedFileExtensions.AAC,
    AllowedFileExtensions.OGG,
    AllowedFileExtensions.M4A,
    AllowedFileExtensions.WMA,
  ];

  if (imageExtensions.includes(ext as AllowedFileExtensions)) {
    return "image";
  }

  if (videoExtensions.includes(ext as AllowedFileExtensions)) {
    return "video";
  }

  if (audioExtensions.includes(ext as AllowedFileExtensions)) {
    return "audio";
  }

  return "other";
};
