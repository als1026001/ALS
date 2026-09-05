import { AppMenuItem } from '../menu.types';

import { VON_BANG_TIEN_MENU } from '../nghiep-vu/von-bang-tien.menu';
import { MUA_HANG_MENU } from '../nghiep-vu/mua-hang.menu';
import { BAN_HANG_MENU } from '../nghiep-vu/ban-hang.menu';
import { KHO_HANG_MENU } from '../nghiep-vu/kho-hang.menu';
import { TAI_SAN_MENU } from '../nghiep-vu/tai-san.menu';
import { THUE_MENU } from '../nghiep-vu/thue.menu';
import { CHUNG_TU_KE_TOAN_MENU } from '../nghiep-vu/chung-tu-ke-toan.menu';
import { HE_THONG_MENU } from '../nghiep-vu/he-thong.menu';

export const NGHIEP_VU_MENU: AppMenuItem = {
    label: 'NGHIỆP VỤ',
    items: [VON_BANG_TIEN_MENU, MUA_HANG_MENU, BAN_HANG_MENU, KHO_HANG_MENU, TAI_SAN_MENU, THUE_MENU, CHUNG_TU_KE_TOAN_MENU, HE_THONG_MENU]
};
