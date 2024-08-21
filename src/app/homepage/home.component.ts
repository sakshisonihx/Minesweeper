import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    currentRoute = 'beginner';
    constructor(private route: Router, private dialog: MatDialog) { }
    onClick(level: string) {
        this.route.navigate(['\home', level])
        this.currentRoute = level;
    }
    openDialog() {
        this.dialog.open(DialogComponent, {
            panelClass: 'custom-dialog-container',
            autoFocus: false
        });
    }
}

@Component({
    selector: 'dialog-popup',
    templateUrl: 'dialog.html',
    styles: [`
    .custom-content {
        background-color: #e6f6ff;
    h3{
        color:#004166;
        font-size: 1.5rem
    }
    }
    .custom-title{
background-color:#ccedff;
color:#004166;
font-family: Salsa;
font-size: 3rem;
padding: 30px 0px;
}
.custom-actions{
        background-color:#ccedff;
button{
color: #004166;
background-color: #7adcff;
}
    }`]
})
export class DialogComponent { }