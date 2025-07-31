import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImageUtils } from "../../utils/imageUtils";
import { storage } from "./firebaseConfig";
import type { UploadFile } from "antd";

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Resize image before upload
  const resizedFile = await ImageUtils.resizeImage(file);

  // Create file path
  const savePath = "mrlamel/images"; // Define your save path

  const ext = resizedFile.name.split(".").pop();
  const fileName = `${Date.now()}_${file.name}.${ext}`; // Unique file name
  const fileRef = ref(storage, `${savePath}/${fileName}`);

  // Upload and return URL
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, resizedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(percent);
        }
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

export const uploadAntDImage = async (
    file: UploadFile
) =>{
    if (file.url) {
        return file.url; // Return existing URL if available
    }
    if (!file.originFileObj) {
        throw new Error("Invalid file");
    }
    return await uploadImage(file.originFileObj);
}
