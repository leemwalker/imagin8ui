import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface GameSetup {
  tone: string;
  genre: string;
  subGenre: string;
  setting: string;
  plot: string;
  style: string;
  storyteller: string;
}

@Component({
  selector: 'app-new-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="new-game-container">
      <h2>New Game Setup</h2>
      
      <div class="setup-form" *ngIf="!showReview">
        <div class="question" *ngIf="currentQuestionIndex === 0">
          <h3>What will the tone of your game be?</h3>
          <p><i>Is it light hearted and cartoonish? Is it gritty and dark?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.tone" placeholder="Enter the tone...">
            <button (click)="submitAnswer('tone')" [disabled]="!gameSetup.tone">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 1">
          <h3>What is the genre?</h3>
          <p><i>Fantasy? Sci-Fi? Alternate History?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.genre" placeholder="Enter the genre...">
            <button (click)="submitAnswer('genre')" [disabled]="!gameSetup.genre">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 2">
          <h3>What is the sub-genre, if any?</h3>
          <p><i>Slice of life, Save the world, or Cyberpunk?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.subGenre" placeholder="Enter the sub-genre...">
            <button (click)="submitAnswer('subGenre')" [disabled]="!gameSetup.subGenre">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 3">
          <h3>Is there a setting already such as an established universe?</h3>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.setting" placeholder="Enter the setting...">
            <button (click)="submitAnswer('setting')" [disabled]="!gameSetup.setting">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 4">
          <h3>Is there a predetermined plot or will this be an open sandbox-style game?</h3>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.plot" placeholder="Enter the plot style...">
            <button (click)="submitAnswer('plot')" [disabled]="!gameSetup.plot">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 5">
          <h3>What is the style of the game?</h3>
          <p><i>Will it be combat heavy or full of roleplaying and social intrigue?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.style" placeholder="Enter the game style...">
            <button (click)="submitAnswer('style')" [disabled]="!gameSetup.style">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 6">
          <h3>Who will be your storyteller?</h3>
          <p><i>Will the role rotate?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="gameSetup.storyteller" placeholder="Enter the storyteller details...">
            <button (click)="submitAnswer('storyteller')" [disabled]="!gameSetup.storyteller">Review</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an answer before continuing.</p>
        </div>
      </div>

      <div class="review-section" *ngIf="showReview">
        <h3>Review Your Game Setup</h3>
        <div class="review-item">
          <label>Tone:</label>
          <input type="text" [(ngModel)]="gameSetup.tone">
        </div>
        <div class="review-item">
          <label>Genre:</label>
          <input type="text" [(ngModel)]="gameSetup.genre">
        </div>
        <div class="review-item">
          <label>Sub-genre:</label>
          <input type="text" [(ngModel)]="gameSetup.subGenre">
        </div>
        <div class="review-item">
          <label>Setting:</label>
          <input type="text" [(ngModel)]="gameSetup.setting">
        </div>
        <div class="review-item">
          <label>Plot Style:</label>
          <input type="text" [(ngModel)]="gameSetup.plot">
        </div>
        <div class="review-item">
          <label>Game Style:</label>
          <input type="text" [(ngModel)]="gameSetup.style">
        </div>
        <div class="review-item">
          <label>Storyteller:</label>
          <input type="text" [(ngModel)]="gameSetup.storyteller">
        </div>
        
        <div class="button-group">
          <button (click)="cancel()">Cancel</button>
          <button (click)="submit()">Create Character</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .new-game-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
    }

    .question {
      margin-bottom: 2rem;
    }

    h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    i {
      color: #7f8c8d;
    }

    .input-group {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    input {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
    }

    button {
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #2980b9;
      }
    }

    .error {
      color: #e74c3c;
      margin-top: 0.5rem;
    }

    .review-section {
      .review-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        align-items: center;

        label {
          min-width: 120px;
          font-weight: bold;
          color: #2c3e50;
        }

        input {
          flex: 1;
        }
      }
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;

      button:first-child {
        background-color: #95a5a6;
      }
    }
  `]
})
export class NewGameComponent {
  gameSetup: GameSetup = {
    tone: '',
    genre: '',
    subGenre: '',
    setting: '',
    plot: '',
    style: '',
    storyteller: ''
  };

  currentQuestionIndex = 0;
  showError = false;
  showReview = false;

  constructor(private router: Router) {}

  submitAnswer(field: keyof GameSetup) {
    if (!this.gameSetup[field]) {
      this.showError = true;
      return;
    }

    this.showError = false;
    if (this.currentQuestionIndex < 6) {
      this.currentQuestionIndex++;
    } else {
      this.showReview = true;
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  submit() {
    // Here we would typically save the game setup data
    this.router.navigate(['/create-character']);
  }
} 