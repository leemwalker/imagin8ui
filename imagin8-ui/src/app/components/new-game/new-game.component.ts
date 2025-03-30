import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

interface GameSetup {
  tone: string;
  genre: string;
  subGenre: string;
  setting: string;
  plot: string;
  style: number;  // Changed to number for slider
  storyteller: string;
  ancestries: string[];
  abilities: string[];
  skills: string[];
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
          <p><i>Balance between combat and roleplay</i></p>
          <div class="slider-container">
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              [(ngModel)]="gameSetup.style"
              class="style-slider">
            <div class="slider-labels">
              <span>Combat</span>
              <span>Mixed</span>
              <span>Roleplay</span>
            </div>
          </div>
          <button (click)="submitAnswer('style')" class="next-button">Next</button>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 6">
          <h3>Are there only specific ancestries allowed in this game?</h3>
          <p><i>Such as dwarves, elves, humans, and hobbits</i></p>
          <div class="dynamic-inputs">
            <div *ngFor="let ancestry of gameSetup.ancestries; let i = index" class="input-group">
              <label [for]="'ancestry-' + i">Ancestry Option {{i + 1}}</label>
              <input 
                [id]="'ancestry-' + i"
                type="text" 
                [(ngModel)]="gameSetup.ancestries[i]" 
                (ngModelChange)="onInputChange('ancestries', i)"
                placeholder="Enter ancestry...">
            </div>
          </div>
          <button 
            (click)="submitDynamicAnswer('ancestries')" 
            class="next-button">
            {{hasAnyValue(gameSetup.ancestries) ? 'Submit' : 'No'}}
          </button>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 7">
          <h3>Do all characters have specific abilities?</h3>
          <div class="dynamic-inputs">
            <div *ngFor="let ability of gameSetup.abilities; let i = index" class="input-group">
              <label [for]="'ability-' + i">Ability Option {{i + 1}}</label>
              <input 
                [id]="'ability-' + i"
                type="text" 
                [(ngModel)]="gameSetup.abilities[i]" 
                (ngModelChange)="onInputChange('abilities', i)"
                placeholder="Enter ability...">
            </div>
          </div>
          <button 
            (click)="submitDynamicAnswer('abilities')" 
            class="next-button">
            {{hasAnyValue(gameSetup.abilities) ? 'Submit' : 'No'}}
          </button>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 8">
          <h3>Do all characters have specific skills?</h3>
          <div class="dynamic-inputs">
            <div *ngFor="let skill of gameSetup.skills; let i = index" class="input-group">
              <label [for]="'skill-' + i">Skill Option {{i + 1}}</label>
              <input 
                [id]="'skill-' + i"
                type="text" 
                [(ngModel)]="gameSetup.skills[i]" 
                (ngModelChange)="onInputChange('skills', i)"
                placeholder="Enter skill...">
            </div>
          </div>
          <button 
            (click)="submitDynamicAnswer('skills')" 
            class="next-button">
            {{hasAnyValue(gameSetup.skills) ? 'Submit' : 'No'}}
          </button>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 9">
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
          <div class="slider-container">
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              [(ngModel)]="gameSetup.style"
              class="style-slider">
          </div>
        </div>
        <div class="review-item">
          <label>Storyteller:</label>
          <input type="text" [(ngModel)]="gameSetup.storyteller">
        </div>
        
        <div class="review-item" *ngIf="hasAnyValue(gameSetup.ancestries)">
          <label>Ancestries:</label>
          <div class="tag-list">
            <span class="tag" *ngFor="let ancestry of gameSetup.ancestries">
              {{ancestry}}
            </span>
          </div>
        </div>
        <div class="review-item" *ngIf="hasAnyValue(gameSetup.abilities)">
          <label>Abilities:</label>
          <div class="tag-list">
            <span class="tag" *ngFor="let ability of gameSetup.abilities">
              {{ability}}
            </span>
          </div>
        </div>
        <div class="review-item" *ngIf="hasAnyValue(gameSetup.skills)">
          <label>Skills:</label>
          <div class="tag-list">
            <span class="tag" *ngFor="let skill of gameSetup.skills">
              {{skill}}
            </span>
          </div>
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

    .slider-container {
      width: 100%;
      margin: 2rem 0;
      position: relative;
    }

    .style-slider {
      width: 100%;
      height: 8px;
      -webkit-appearance: none;
      background: #e0e0e0;
      outline: none;
      border-radius: 4px;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
      }
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .dynamic-inputs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.9rem;
    }

    .next-button {
      min-width: 100px;
    }

    .dynamic-inputs .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .dynamic-inputs label {
      font-weight: 500;
      color: var(--text-color);
    }

    .dynamic-inputs input {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
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
    style: 3,
    storyteller: '',
    ancestries: [''],
    abilities: [''],
    skills: ['']
  };

  currentQuestionIndex = 0;
  showReview = false;
  showError = false;

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  submitAnswer(field: keyof GameSetup) {
    if (field === 'style' || this.gameSetup[field]) {
      this.showError = false;
      if (this.currentQuestionIndex < 9) {
        this.currentQuestionIndex++;
      } else {
        this.showReview = true;
      }
    } else {
      this.showError = true;
    }
  }

  onInputChange(field: 'ancestries' | 'abilities' | 'skills', index: number) {
    const array = this.gameSetup[field];
    // Only add a new input if the current one is the last one and has content
    if (index === array.length - 1 && array[index].trim() !== '') {
      array.push('');
    }
  }

  hasAnyValue(array: string[]): boolean {
    return array.some(item => item.trim() !== '');
  }

  submitDynamicAnswer(field: 'ancestries' | 'abilities' | 'skills') {
    const array = this.gameSetup[field];
    // Remove any empty values
    this.gameSetup[field] = array.filter(item => item.trim() !== '');
    this.nextQuestion();
  }

  cancel() {
    this.router.navigate(['/']);
  }

  submit() {
    // Save the game setup to the service
    this.gameStateService.setGameSetup(this.gameSetup);
    
    // Navigate to character creation
    this.router.navigate(['/create-character']);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
  }
} 