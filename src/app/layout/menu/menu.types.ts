import { MenuItem } from 'primeng/api';

export type AppMenuItem = MenuItem & {
    path?: string;
    items?: AppMenuItem[];
};
