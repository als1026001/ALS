import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
    @Input() icon = 'pi pi-inbox';
    @Input() title = 'Không có dữ liệu';
    @Input() message = '';
}
