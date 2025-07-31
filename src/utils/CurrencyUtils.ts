export class CurrencyUtils {
  /**
   * Format một số thành chuỗi tiền Việt Nam (VND)
   * @param amount Số tiền cần format (ví dụ: 1000000)
   * @returns Chuỗi định dạng tiền Việt (ví dụ: "1.000.000 ₫")
   */
  static formatVND(amount: number): string {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  /**
   * Chuyển chuỗi tiền tệ về số (chỉ giữ lại số)
   * @param currencyStr Chuỗi tiền (ví dụ: "1.000.000 ₫")
   * @returns Số nguyên (ví dụ: 1000000)
   */
  static parseVND(currencyStr: string): number {
    return parseInt(currencyStr.replace(/[^\d]/g, ""), 10);
  }
}
