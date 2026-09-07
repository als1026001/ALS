/**
 * Chuyển ngày từ DD/MM/YYYY sang YYYY-MM-DD.
 * Dùng cho input type="date" và so sánh ngày dạng chuỗi.
 */
export function toInputDate(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    const [day, month, year] = value.split('/');

    if (!day || !month || !year) {
        return value;
    }

    return `${year}-${month}-${day}`;
}

/**
 * Chuyển ngày từ YYYY-MM-DD sang DD/MM/YYYY.
 * Dùng để lưu/hiển thị ngày chứng từ.
 */
export function formatDisplayDate(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    const [year, month, day] = value.split('-');

    if (!year || !month || !day) {
        return value;
    }

    return `${day}/${month}/${year}`;
}
