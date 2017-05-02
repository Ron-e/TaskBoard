import {
    Component,
    Input,
    ElementRef
} from '@angular/core';

import { ContextMenuItem } from './context-menu-item.model';
import { ContextMenuService } from './context-menu.service';

@Component({
    selector: 'tb-context-menu',
    templateUrl: 'app/shared/context-menu/context-menu.component.html'
})
export class ContextMenu {
    @Input('menu-items') menuItems: Array<ContextMenuItem>;

    isOpen = false;
    animate = true;

    constructor(private el: ElementRef,
                private menuService: ContextMenuService) {
        menuService.registerMenu(this);

        let parentElement = el.nativeElement.parentElement;

        parentElement.oncontextmenu = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            this.onParentContextMenu(event);
        };
    }

    callAction(action: Function) {
        if (action) {
            action();
        }
    }

    private onParentContextMenu(event: MouseEvent) {
        this.menuService.closeAllMenus();
        this.isOpen = true;

        let edgeBuffer = 10;
        let target = this.el.nativeElement.firstElementChild;

        // Set to the event position by default
        target.style.left = event.pageX + 'px';
        target.style.top = event.pageY + 'px';

        // Adjust position if near an edge
        setTimeout(() => {
            let rect = target.getBoundingClientRect();

            let offsetX = (event.pageX + rect.width + edgeBuffer) > window.innerWidth;
            let offsetY = (event.pageY + rect.height + edgeBuffer) > window.innerHeight;

            target.style.left = event.pageX - (offsetX ? rect.width : 0) + 'px';
            target.style.top = event.pageY - (offsetY ? rect.height : 0) + 'px';
        },
        0);
    }
}

