import Resizer from "react-image-file-resizer";


export class ImageUtils {
  public static resizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1080, // max width
        720, // max height
        "WEBP", // compress format
        70, // quality
        0, // rotation
        (uri) => {
          if (typeof uri === "string") {
            resolve(new File([uri], file.name, { type: file.type }));
          } else {
            resolve(uri as File);
          }
        },
        "file" // output type
      );
    });
  }
}