import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./phieu-thu.component').then((m) => m.PhieuThuComponent)
    }
] as Routes;
