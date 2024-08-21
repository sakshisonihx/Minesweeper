// click-blocker.component.ts
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-click-blocker',
    template: '<div class="click-blocker"> <h1>Blocked</h1></div>',
    styles: [`.click-blocker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Optional: Add some opacity to indicate blocking */
  z-index: 1000; /* Ensure it's on top */
  pointer-events: none; /* Prevent any interactions with this element itself */
}`]
})
export class ClickBlockerComponent {
}
