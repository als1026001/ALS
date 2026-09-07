import { Routes } from '@angular/router';

export default [
    {
        path: 'bao-co',
        loadChildren: () => import('./bao-co/bao-co.routes')
    },
    {
        path: 'bao-no',
        loadChildren: () => import('./bao-no/bao-no.routes')
    },
    {
        path: 'phieu-thu',
        loadChildren: () => import('./phieu-thu/phieu-thu.routes')
    },
    {
        path: 'phieu-chi',
        loadChildren: () => import('./phieu-chi/phieu-chi.routes')
    }
] as Routes;
