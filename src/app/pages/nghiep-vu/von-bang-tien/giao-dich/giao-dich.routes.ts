import { Routes } from '@angular/router';

export default [
    {
        path: 'bao-co',
        loadChildren: () => import('./bao-co/bao-co.routes')
    },
    {
        path: 'bao-no',
        loadChildren: () => import('./bao-no/bao-no.routes')
    }
] as Routes;
