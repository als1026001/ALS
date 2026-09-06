# Sidebar Menu Modes

The Sakai sidebar now supports three sources without changing the sidebar component.

## Configuration

Edit:

`src/app/layout/menu/config/sidebar-menu.config.ts`

The default is:

```ts
export const SIDEBAR_MENU_CONFIG = {
    defaultMode: 'fixed',
    persistMode: true,
    storageKey: 'als.erp.sidebar.menu-mode',
    fallbackToFixedOnApiError: true,
    hybridFixedRootLabels: ['Home']
};
```

## Modes

### `fixed`
Uses the existing `APP_MENU` only. No sidebar API call is required.

### `api`
Uses `GET /api/menu`. The backend controls the visible business menu by the authenticated user's role/permissions.

If the API call fails and `fallbackToFixedOnApiError` is `true`, the sidebar automatically falls back to `APP_MENU` instead of becoming blank.

### `hybrid`
Uses selected fixed root sections plus the permission-filtered API menu.

By default only `Home` is fixed:

```ts
hybridFixedRootLabels: ['Home']
```

You can keep more fixed sections if required, for example:

```ts
hybridFixedRootLabels: ['Home', 'UI Components']
```

For security-sensitive ERP business modules, prefer serving them from the API in hybrid mode. API authorization still remains the final security boundary even when a fixed link is visible.

## Runtime switching

`SidebarMenuService` exposes:

```ts
setMode('fixed');
setMode('api');
setMode('hybrid');
resetMode();
```

When `persistMode` is enabled, the selected mode is saved in localStorage and survives refresh/login.

A future Settings/Configurator page can inject `SidebarMenuService` and call these methods directly; no sidebar rewrite is necessary.
