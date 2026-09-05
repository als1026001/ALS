import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./bao-no.component').then((m) => m.BaoNoComponent)
    }
] as Routes;
