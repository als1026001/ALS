export function formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return '0';
    }

    return new Intl.NumberFormat('vi-VN').format(value);
}
