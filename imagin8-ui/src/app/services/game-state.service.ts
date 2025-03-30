import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameSetup {
  tone: string;
  genre: string;
  subGenre: string;
  setting: string;
  plot: string;
  style: number;
  storyteller: string;
  ancestries: string[];
  abilities: string[];
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private gameSetup = new BehaviorSubject<GameSetup | null>(null);
  gameSetup$ = this.gameSetup.asObservable();

  setGameSetup(setup: GameSetup) {
    this.gameSetup.next(setup);
  }

  getGameSetup(): GameSetup | null {
    return this.gameSetup.value;
  }

  clearGameSetup() {
    this.gameSetup.next(null);
  }
} 