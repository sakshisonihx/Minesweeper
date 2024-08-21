import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
    isBlocking: boolean = false
    board: Cell[][] = [];
    level: string = ''
    rside: number = 0;
    cside: number = 0;
    noOfMine: number = 0;
    constructor(private route: ActivatedRoute) { }
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
    initializeBoard() {
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
        if (row >= this.cside || col >= this.rside || row < 0 || col < 0 || this.board[row][col]?.revealed || this.board[row][col]?.isFlaged)
            return;
        this.board[row][col].revealed = true;
        if (this.board[row][col]?.isMine) {
            this.isBlocking = true;
            let audio2 = new Audio("../../assets/sounds/lose_minesweeper.wav");
            audio2.load();
            audio2.play();
            setTimeout(() => { this.gameover() }, 1000);
            this.isBlocking = false;
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
        else { this.won(); }
    }
    onRightClick(event: MouseEvent, ir: number, ij: number) {
        event.preventDefault();
        // const selection = window.getSelection();
        // if (selection) {
        //     selection.removeAllRanges(); // Clear any selected text
        // }
        if (!this.board[ir][ij]?.revealed)
            this.board[ir][ij].isFlaged = !this.board[ir][ij].isFlaged;
    }
    onDoubleClick(row: number, col: number) {
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
                        this.isBlocking = true;
                        let audio2 = new Audio("../../assets/sounds/lose_minesweeper.wav");
                        audio2.load();
                        audio2.play();
                        setTimeout(() => { this.gameover() }, 1000);
                        this.isBlocking = false;
                    }
                    else if (!this.board[row + dx]?.[col + dy]?.isFlaged) {
                        this.revealCell(row + dx, col + dy);
                    }
                }
            }
        }
    }
    gameover() {
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
            this.isBlocking = true;
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
            this.isBlocking = false;
        }
    }
}