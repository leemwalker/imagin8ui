import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <div class="title-section">
        <h1>Imagin8</h1>
        <div class="dice-eight">
          <svg viewBox="0 0 100 100" width="50" height="50">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" 
                     fill="none" 
                     stroke="currentColor" 
                     stroke-width="4"/>
            <text x="50" y="60" 
                  text-anchor="middle" 
                  fill="currentColor" 
                  font-size="30">8</text>
          </svg>
        </div>
      </div>
      
      <div class="options-section">
        <button (click)="navigateTo('new-game')" class="option-button">
          Start New Game
        </button>
        <button (click)="navigateTo('create-character')" class="option-button">
          Create Character
        </button>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    h1 {
      font-size: 3rem;
      margin: 0;
      color: #2c3e50;
    }

    .dice-eight {
      color: #2c3e50;
    }

    .options-section {
      display: flex;
      gap: 1rem;
    }

    .option-button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 8px;
      background-color: #3498db;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #2980b9;
      }
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
} 