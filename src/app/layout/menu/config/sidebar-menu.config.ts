export type SidebarMenuMode = 'fixed' | 'api' | 'hybrid';

export interface SidebarMenuConfig {
    /** Default source used when the user has not selected a mode yet. */
    defaultMode: SidebarMenuMode;

    /** Persist the selected mode so it survives refresh/login. */
    persistMode: boolean;

    /** LocalStorage key used when persistMode is enabled. */
    storageKey: string;

    /**
     * If the API menu cannot be loaded, fall back to the complete fixed
     * APP_MENU instead of leaving the sidebar empty.
     */
    fallbackToFixedOnApiError: boolean;

    /**
     * In hybrid mode only these root sections are taken from APP_MENU.
     * The permission-filtered API menu is then appended.
     *
     * Keeping this list explicit prevents fixed business menus from
     * accidentally bypassing API-driven menu visibility.
     */
    hybridFixedRootLabels: string[];
}

export const SIDEBAR_MENU_CONFIG: SidebarMenuConfig = {
    defaultMode: 'fixed',
    persistMode: true,
    storageKey: 'als.erp.sidebar.menu-mode',
    fallbackToFixedOnApiError: true,
    hybridFixedRootLabels: ['Home']
};
