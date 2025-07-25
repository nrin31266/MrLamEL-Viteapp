import { v4 as uuidv4 } from 'uuid';

export class DeviceUtils {
  public static getDeviceInfo(): { deviceId: string; deviceName: string } {
    // This is a placeholder implementation. Replace with actual device detection logic.
    const key = 'device_id';
    let deviceId = localStorage.getItem(key);
    if(!deviceId || deviceId.length < 36) {
         deviceId = uuidv4(); // random một UUID mới, UUID có độ dài là 36
        localStorage.setItem(key, deviceId); // lưu lại để lần sau dùng
    }
    return {
      deviceId: deviceId,
      deviceName: window.navigator.userAgent // Lấy thông tin user agent của trình duyệt
    };
  }
}