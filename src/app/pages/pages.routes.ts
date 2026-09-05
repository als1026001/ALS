import { Routes } from '@angular/router';

import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    {
        path: 'documentation',
        component: Documentation
    },

    {
        path: 'crud',
        component: Crud
    },

    {
        path: 'empty',
        component: Empty
    },

    {
        path: 'nghiep-vu',
        children: [
            {
                path: 'von-bang-tien',
                loadChildren: () => import('./nghiep-vu/von-bang-tien/von-bang-tien.routes')
            }
        ]
    },

    {
        path: '**',
        redirectTo: '/notfound'
    }
] as Routes;
