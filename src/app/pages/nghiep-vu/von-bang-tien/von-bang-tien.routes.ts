import { Routes } from '@angular/router';

export default [
    {
        path: 'giao-dich',
        loadChildren: () => import('./giao-dich/giao-dich.routes')
    }
] as Routes;
