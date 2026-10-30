import { Routes } from '@angular/router';
import { routePermissionGuard } from '../../core/guards/route-permission.guard';

export const featureRoutes: Routes = [
    {
        path: 'hrDepartment',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrDepartment' },
        loadComponent: () =>
            import('./master/hr-department/hr-department').then(m => m.HrDepartment)
    },
    {
        path: 'hrEmployeePosition',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrEmployeePosition' },
        loadComponent: () =>
            import('./master/hr-employee-position/hr-employee-position').then(m => m.HrEmployeePosition)
    },
    {
        path: 'hrEmployeeGroup',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrEmployeeGroup' },
        loadComponent: () =>
            import('./master/hr-employee-group/hr-employee-group').then(m => m.HrEmployeeGroup)
    },
    {
        path: 'hrEmployeeDegree',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrEmployeeDegree' },
        loadComponent: () =>
            import('./master/hr-employee-degree/hr-employee-degree').then(m => m.HrEmployeeDegree)
    },
    {
        path: 'hrEmployeeAllowance',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrEmployeeAllowance' },
        loadComponent: () =>
            import('./master/hr-employee-allowance/hr-employee-allowance').then(m => m.HrEmployeeAllowance)
    },
    {
        path: 'hrEmployeeLeave',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrEmployeeLeave' },
        loadComponent: () =>
            import('./master/hr-employee-leave/hr-employee-leave').then(m => m.HrEmployeeLeave)
    },
    {
        path: 'hrOvertimeType',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrOvertimeType' },
        loadComponent: () =>
            import('./master/hr-overtime-type/hr-overtime-type').then(m => m.HrOvertimeType)
    },
    {
        path: 'hrResignationReason',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrResignationReason' },
        loadComponent: () =>
            import('./master/hr-resignation-reason/hr-resignation-reason').then(m => m.HrResignationReason)
    },
    {
        path: 'hrAttendanceType',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrAttendanceType' },
        loadComponent: () =>
            import('./master/hr-attendance-type/hr-attendance-type').then(m => m.HrAttendanceType)
    },
    {
        path: 'hrNationality',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrNationality' },
        loadComponent: () =>
            import('./master/hr-nationality/hr-nationality').then(m => m.HrNationality)
    },
    {
        path: 'hrAnnualLeave',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrAnnualLeave' },
        loadComponent: () =>
            import('./transaction/hr-annual-leave/hr-annual-leave').then(m => m.HrAnnualLeave)
    },
    {
        path: 'hrCheckInOut',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrCheckInOut' },
        loadComponent: () =>
            import('./transaction/hr-check-in-out/hr-check-in-out').then(m => m.HrCheckInOut)
    },
    {
        path: 'hrManualCheckInOut',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrManualCheckInOut' },
        loadComponent: () =>
            import('./transaction/hr-manual-check-in-out/hr-manual-check-in-out').then(m => m.HrManualCheckInOut)
    },
    {
        path: 'hrAllowanceTransaction',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrAllowanceTransaction' },
        loadComponent: () =>
            import('./transaction/hr-allowance-transaction/hr-allowance-transaction').then(m => m.HrAllowanceTransaction)
    },
    {
        path: 'hrFingerFacialPrint',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrFingerFacialPrint' },
        loadComponent: () =>
            import('./transaction/hr-finger-facial-print/hr-finger-facial-print').then(m => m.HrFingerFacialPrint)
    },
    {
        path: 'hrInformationChange',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrInformationChange' },
        loadComponent: () =>
            import('./transaction/hr-information-change/hr-information-change').then(m => m.HrInformationChange)
    },
    {
        path: 'hrResignation',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrResignation' },
        loadComponent: () =>
            import('./transaction/hr-resignation/hr-resignation').then(m => m.HrResignation)
    },
    {
        path: 'hrLaborContract',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrLaborContract' },
        loadComponent: () =>
            import('./transaction/hr-labor-contract/hr-labor-contract').then(m => m.HrLaborContract)
    },
    {
        path: 'hrLaborContractAppendix',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrLaborContractAppendix' },
        loadComponent: () =>
            import('./transaction/hr-labor-contract-appendix/hr-labor-contract-appendix').then(m => m.HrLaborContractAppendix)
    },
    {
        path: 'hrPregnancySickness',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrPregnancySickness' },
        loadComponent: () =>
            import('./transaction/hr-pregnancy-sickness/hr-pregnancy-sickness').then(m => m.HrPregnancySickness)
    },
    {
        path: 'hrProbationaryContract',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrProbationaryContract' },
        loadComponent: () =>
            import('./transaction/hr-probationary-contract/hr-probationary-contract').then(m => m.HrProbationaryContract)
    },
    {
        path: 'hrSalaryAdjustment',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrSalaryAdjustment' },
        loadComponent: () =>
            import('./transaction/hr-salary-adjustment/hr-salary-adjustment').then(m => m.HrSalaryAdjustment)
    },
    {
        path: 'hrWorkSchedule01',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrWorkSchedule01' },
        loadComponent: () =>
            import('./transaction/hr-work-schedule01/hr-work-schedule01').then(m => m.HrWorkSchedule01)
    },
    {
        path: 'hrWorkSchedule02',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrWorkSchedule02' },
        loadComponent: () =>
            import('./transaction/hr-work-schedule02/hr-work-schedule02').then(m => m.HrWorkSchedule02)
    },
    {
        path: 'hrAttendance',
        canActivate: [routePermissionGuard],
        data: { permissionRoute: '/hrAttendance' },
        loadComponent: () =>
            import('./transaction/hr-attendance/hr-attendance').then(m => m.HrAttendance)
    },
];
