import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private timerSubject = new BehaviorSubject<string>('00:00'); // Initial time value
  timer$ = this.timerSubject.asObservable(); // Expose the timer as an observable

  private flagCountSubject = new BehaviorSubject<number>(0);
  flagCount$ = this.flagCountSubject.asObservable();

  private gameOverSubject = new BehaviorSubject<boolean>(false);
  gameOver$ = this.gameOverSubject.asObservable();
  constructor() { }

  updateTimer(time: string) {
    this.timerSubject.next(time); // Update the timer
  }
  updateFlagCount(count: number) {
    this.flagCountSubject.next(count);
  }

  updateGameOver(status: boolean) {
    this.gameOverSubject.next(status);
  }
}