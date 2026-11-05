import { Injectable } from '@angular/core';


import { AppMenuItem } from '../models/app-menu-item';

@Injectable({
    providedIn: 'root'
})
export class MenuTranslationService {
    translateMenu(item: AppMenuItem): string {
        // Menu label is already localized by the API.
        return item.label;
    }
}
