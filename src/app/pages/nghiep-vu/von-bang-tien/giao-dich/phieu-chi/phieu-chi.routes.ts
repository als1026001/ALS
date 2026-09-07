import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./phieu-chi.component').then((m) => m.PhieuChiComponent)
    }
] as Routes;
