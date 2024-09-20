import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentRoute = '';
    currentTime: string = '00:00';
    flagCount: number = 0;
    gameStatus: boolean = false;
    constructor(private route: Router, private dialog: MatDialog, private dataService: DataService) { }
    ngOnInit() {
        this.dataService.timer$.subscribe(time => {
            this.currentTime = time;
        });
        this.dataService.flagCount$.subscribe(count => {
            this.flagCount = count;
        });
        this.dataService.gameOver$.subscribe(status => {
            this.gameStatus = status;
        });
        const string = this.route.url.match(/\/home\/(beginner|intermediate|advance)/);
        if (string)
            this.currentRoute = string[1]
        else
            this.currentRoute = 'beginner'
        this.route.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const match = event.url.match(/\/home\/(beginner|intermediate|advance)/);
                if (match)
                    this.currentRoute = match[1]
            }
        });
    }
    onClick(level: string) {
        if (this.gameStatus) {
            return;
        }
        this.route.navigate(['\home', level])
        this.currentRoute = level;
    }
    openDialog() {
        this.dialog.open(DialogComponent, {
            panelClass: 'custom-dialog-container',
            autoFocus: false
        });
    }
    restart() {
        this.gameStatus = false;
        this.dataService.updateGameOver(false);
        window.location.reload();
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