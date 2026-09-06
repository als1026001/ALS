# Advanced ERP.API Frontend Integration

This frontend has been integrated with the advanced ERP.API contract used in this conversation.

## API base URL

Edit `src/app/core/config/api.config.ts` when the ASP.NET Core launch URL changes.

Default:

```ts
export const API_BASE_URL = 'https://localhost:7001/api';
```

## Authentication

Login sends:

```json
{
  "tenantId": 1,
  "companyId": null,
  "username": "admin",
  "password": "..."
}
```

`companyId` is optional. The JWT is stored under `access_token` and is automatically attached to authenticated API calls. HTTP 401 responses clear the session and return to `/auth/login`.

## Color feature

Frontend route: `/color`

Backend endpoints:

- `GET /api/color?page=1&pageSize=20&search=&sortField=colorNo&sortDirection=asc`
- `GET /api/color/{colorId}`
- `POST /api/color`
- `PUT /api/color/{colorId}`
- `DELETE /api/color/{colorId}`

Permissions are read from:

- `GET /api/permissions/access?routerLink=/color`

The route guard requires `canView`. New/Edit/Delete buttons use `canCreate`, `canUpdate`, and `canDelete`. The API must still enforce all permissions server-side.

## Dynamic menus

Both the topbar and sidebar now use `GET /api/menu`. The old static Sakai sidebar demo menu is no longer the active source.

For Color to appear in the authenticated menu, the database menu record must use a router link compatible with `/color`, and the current user's role must have a corresponding active `suser_role_permission` row.

## Important database rule

The advanced backend expects Color permissions to resolve by the database route `/color`. Keep the backend `FeatureRoutes:Color` value and the `smenu.router_link` value aligned.
