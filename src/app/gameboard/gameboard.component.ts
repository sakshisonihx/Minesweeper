import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../data.service";
interface Cell {
    isMine: boolean,
    revealed: boolean,
    count: number,
    isFlaged: boolean
}
@Component({
    selector: 'app-gameboard',
    templateUrl: './gameboard.component.html',
    styleUrls: ['./gameboard.component.css']
})
export class GameBoardComponent implements OnInit {
    board: Cell[][] = [];
    level: string = '';
    rside: number = 0;
    cside: number = 0;
    noOfMine: number = 0;
    flagCount: number = 0;
    timer: any;
    timeElapsed: number = 0; // Time in seconds
    isFirstClick: boolean = true;
    isGameOver: boolean = false;
    displayTime: string = '00:00';
    constructor(private route: ActivatedRoute, private dataService: DataService) { }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.level = params['level'];
            if (this.level == 'beginner') {
                this.rside = this.cside = 9; this.noOfMine = 10;
            } else if (this.level == 'intermediate') {
                this.rside = 13; this.cside = 15; this.noOfMine = 40;
            } else if (this.level == 'advance') {
                this.rside = 16; this.cside = 30; this.noOfMine = 99;
            }
            this.initializeBoard();
        })
    }
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateDisplayTime();
        }, 1000); // Increment time every second
    }
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    updateDisplayTime() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        this.displayTime = `${formattedMinutes}:${formattedSeconds}`;
        this.dataService.updateTimer(this.displayTime);
    }
    initializeBoard() {
        this.stopTimer();
        this.isFirstClick = true;
        this.isGameOver = false;
        this.timeElapsed = 0;
        this.flagCount = this.noOfMine;
        this.dataService.updateTimer('00:00');
        this.dataService.updateFlagCount(this.noOfMine);
        this.dataService.updateGameOver(false);
        let audio1 = new Audio("../../assets/sounds/start.wav")
        audio1.play()
        this.board.length = 0;
        for (let i = 0; i < this.cside; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.rside; j++) {
                this.board[i][j] = {
                    isMine: false,
                    revealed: false,
                    count: 0,
                    isFlaged: false
                }
            }
        }
        //placing mines
        let minesPlaced = 0;
        while (minesPlaced < this.noOfMine) {
            const row = Math.floor(Math.random() * this.cside);
            const col = Math.floor(Math.random() * this.rside);
            if (!this.board[row][col].isMine) {
                this.board[row][col].isMine = true;
                minesPlaced++;
            }
        }
        //getting count
        for (let i = 0; i < this.cside; i++) {
            for (let j = 0; j < this.rside; j++) {
                if (!this.board[i][j].isMine) {
                    let counting = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            const ni = i + dx;
                            const nj = dy + j;
                            if (ni >= 0 && nj >= 0 && ni < this.cside && nj < this.rside && this.board[ni][nj].isMine) {
                                counting++;
                            }
                        }
                    }
                    this.board[i][j].count = counting;
                }
            }
        }
    }
    revealCell(row: number, col: number, is_First = true) {
        if (this.isGameOver) return;
        if (row >= this.cside || col >= this.rside || row < 0 || col < 0 || this.board[row][col]?.revealed || this.board[row][col]?.isFlaged)
            return;
        if (this.isFirstClick && !this.isGameOver) {
            this.isFirstClick = false;
            this.startTimer(); // Start the timer on first click
        }
        this.board[row][col].revealed = true;
        if (this.board[row][col]?.isMine) {
            let audio2 = new Audio("../../assets/sounds/lose_minesweeper.wav");
            audio2.load();
            audio2.play();
            this.stopTimer(); // Stop the timer if the game is over
            setTimeout(() => { this.gameover() }, 1000);
        } else if (this.board[row][col]?.count === 0) {
            if (is_First) {
                let audio3 = new Audio("../../assets/sounds/click.wav");
                audio3.load();
                audio3.play();
            }
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    this.revealCell(row + dx, col + dy, is_First = false);
                }
            }
            this.won();
        }
        else {
            this.won();
        }
    }
    onRightClick(event: MouseEvent, ir: number, ij: number) {
        event.preventDefault();
        if (this.isGameOver) return;
        if (!this.board[ir][ij]?.revealed) {
            if (this.board[ir][ij].isFlaged) {
                this.dataService.updateFlagCount(++this.flagCount);
            } else {
                this.dataService.updateFlagCount(--this.flagCount);
            }
            this.board[ir][ij].isFlaged = !this.board[ir][ij].isFlaged;
        }

    }
    onDoubleClick(row: number, col: number) {
        if (this.isGameOver) return;
        if (row >= this.cside || col >= this.rside || row < 0 || col < 0 || this.board[row][col]?.isFlaged) {
            return;
        }
        let counting = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const ni = row + dx;
                const nj = col + dy;
                if (ni >= 0 && nj >= 0 && ni < this.cside && nj < this.rside && this.board[ni][nj]?.isFlaged) {
                    counting++;
                }
            }
        }
        if (counting === this.board[row][col].count) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (this.board[row + dx]?.[col + dy]?.isMine && !this.board[row + dx]?.[col + dy]?.isFlaged) {
                        this.board[row + dx][col + dy].revealed = true;
                        let audio2 = new Audio("../../assets/sounds/lose_minesweeper.wav");
                        audio2.load();
                        audio2.play();
                        setTimeout(() => { this.gameover() }, 1000);
                    }
                    else if (!this.board[row + dx]?.[col + dy]?.isFlaged) {
                        this.revealCell(row + dx, col + dy);
                    }

                }
            }
        }
    }
    gameover() {
        this.dataService.updateGameOver(true);
        this.isGameOver = true;
        let i = 0;
        let j = 0;
        const revealMinesRecursively = () => {
            if (i >= this.cside) return;
            if (j >= this.rside) {
                i++;
                j = 0;
            }
            if (i < this.cside && j < this.rside && this.board[i][j].isMine && !this.board[i][j].isFlaged) {
                let audio2 = new Audio("../../assets/sounds/lose_minesweeper.wav");
                audio2.load();
                audio2.play();
                this.board[i][j].revealed = true;
            }
            j++;
            setTimeout(revealMinesRecursively, 5);
        };
        revealMinesRecursively();
    }
    won() {
        var revealed = document.querySelectorAll(".revealed").length + 1;
        if ((this.rside * this.cside) - revealed === this.noOfMine) {
            this.dataService.updateGameOver(true);
            this.isGameOver = true;
            this.stopTimer();
            this.dataService.updateFlagCount(0);
            var audio4 = new Audio("../../assets/sounds/win.wav");
            audio4.load();
            audio4.play();
            let i = 0;
            let j = 0;
            const placeFlag = () => {
                if (i >= this.cside) return;
                if (j >= this.rside) {
                    i++;
                    j = 0;
                }
                if (i < this.cside && j < this.rside && this.board[i][j].isMine && !this.board[i][j].isFlaged) {
                    this.board[i][j].isFlaged = true;
                }
                j++;
                setTimeout(placeFlag, 5);
            };
            setTimeout(placeFlag, 1000);
        }
    }
}