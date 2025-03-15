import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CharacterBasics {
  name: string;
  ancestry: string;
  appearance: string;
  background: string;
  goal: string;
}

interface AttributePoints {
  [key: string]: number;
}

@Component({
  selector: 'app-character-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="character-creation-container">
      <h2>Character Creation</h2>

      <!-- Basic Information Section -->
      <div class="section" *ngIf="currentStep === 'basics'">
        <div class="question" *ngIf="currentQuestionIndex === 0">
          <h3>What is your Name?</h3>
          <div class="input-group">
            <input type="text" [(ngModel)]="characterBasics.name" placeholder="Enter character name...">
            <button (click)="submitBasicInfo('name')" [disabled]="!characterBasics.name">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide a name before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 1">
          <h3>What is your Ancestry?</h3>
          <p><i>Elf? Alien?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="characterBasics.ancestry" placeholder="Enter ancestry...">
            <button (click)="submitBasicInfo('ancestry')" [disabled]="!characterBasics.ancestry">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an ancestry before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 2">
          <h3>What do you look like?</h3>
          <div class="input-group">
            <textarea [(ngModel)]="characterBasics.appearance" placeholder="Describe your character's appearance..."></textarea>
            <button (click)="submitBasicInfo('appearance')" [disabled]="!characterBasics.appearance">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide an appearance description before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 3">
          <h3>What is your Background?</h3>
          <p><i>Asteroid miner? Social Climber?</i></p>
          <div class="input-group">
            <input type="text" [(ngModel)]="characterBasics.background" placeholder="Enter background...">
            <button (click)="submitBasicInfo('background')" [disabled]="!characterBasics.background">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide a background before continuing.</p>
        </div>

        <div class="question" *ngIf="currentQuestionIndex === 4">
          <h3>What is your goal/ambition?</h3>
          <div class="input-group">
            <textarea [(ngModel)]="characterBasics.goal" placeholder="Describe your character's goals..."></textarea>
            <button (click)="submitBasicInfo('goal')" [disabled]="!characterBasics.goal">Next</button>
          </div>
          <p class="error" *ngIf="showError">Please provide a goal before continuing.</p>
        </div>
      </div>

      <!-- Point Allocation Section -->
      <div class="section" *ngIf="currentStep === 'points'">
        <div class="points-info">
          <h3>Point Allocation</h3>
          <p>You have {{remainingAttributePoints}} attribute points and {{remainingSkillPoints}} skill points remaining.</p>
          <p>Points from either pool can be used for abilities. No attribute, skill, or ability can have more than 2 points.</p>
        </div>

        <!-- Attributes -->
        <div class="attributes-section">
          <h4>Attributes</h4>
          <div class="attribute-item" *ngFor="let attr of attributes">
            <label>{{attr}}</label>
            <div class="point-buttons">
              <button 
                *ngFor="let i of [1, 2]" 
                [class.selected]="attributePoints[attr] === i"
                [disabled]="!canAllocatePoint(attr, i, 'attribute')"
                (click)="allocatePoint(attr, i, 'attribute')"
                class="point-button">
              </button>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="skills-section">
          <h4>Skills</h4>
          <div class="skill-list">
            <div class="skill-item" *ngFor="let skill of skills; let i = index">
              <input type="text" [(ngModel)]="skills[i]" placeholder="Enter skill name...">
              <div class="point-buttons">
                <button 
                  *ngFor="let j of [1, 2]" 
                  [class.selected]="skillPoints[skill] === j"
                  [disabled]="!canAllocatePoint(skill, j, 'skill')"
                  (click)="allocatePoint(skill, j, 'skill')"
                  class="point-button">
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Abilities -->
        <div class="abilities-section">
          <h4>Abilities</h4>
          <div class="ability-list">
            <div class="ability-item" *ngFor="let ability of abilities; let i = index">
              <input type="text" [(ngModel)]="abilities[i]" placeholder="Enter ability name...">
              <div class="point-buttons">
                <button 
                  *ngFor="let j of [1, 2]" 
                  [class.selected]="abilityPoints[ability] === j"
                  [disabled]="!canAllocatePoint(ability, j, 'ability')"
                  (click)="allocatePoint(ability, j, 'ability')"
                  class="point-button">
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button (click)="cancel()">Cancel</button>
          <button 
            (click)="showCharacterSheet()" 
            [disabled]="!canShowCharacterSheet()">
            View Character Sheet
          </button>
        </div>
      </div>

      <!-- Character Sheet View -->
      <div class="section" *ngIf="currentStep === 'sheet'">
        <h3>Character Sheet</h3>
        
        <div class="character-sheet">
          <div class="basics">
            <h4>Basic Information</h4>
            <p><strong>Name:</strong> {{characterBasics.name}}</p>
            <p><strong>Ancestry:</strong> {{characterBasics.ancestry}}</p>
            <p><strong>Appearance:</strong> {{characterBasics.appearance}}</p>
            <p><strong>Background:</strong> {{characterBasics.background}}</p>
            <p><strong>Goal:</strong> {{characterBasics.goal}}</p>
          </div>

          <div class="stats">
            <div class="attributes">
              <h4>Attributes</h4>
              <div *ngFor="let attr of attributes">
                <p *ngIf="attributePoints[attr] > 0">
                  <strong>{{attr}}:</strong> {{attributePoints[attr]}}
                </p>
              </div>
            </div>

            <div class="skills">
              <h4>Skills</h4>
              <div *ngFor="let skill of skills">
                <p *ngIf="skillPoints[skill] > 0">
                  <strong>{{skill}}:</strong> {{skillPoints[skill]}}
                </p>
              </div>
            </div>

            <div class="abilities">
              <h4>Abilities</h4>
              <div *ngFor="let ability of abilities">
                <p *ngIf="abilityPoints[ability] > 0">
                  <strong>{{ability}}:</strong> {{abilityPoints[ability]}}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button (click)="cancel()">Start Over</button>
          <button (click)="currentStep = 'points'">Edit Points</button>
          <button (click)="saveCharacter()">Save Character</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .character-creation-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2, h3, h4 {
      color: #2c3e50;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .section {
      margin-bottom: 2rem;
    }

    .question {
      margin-bottom: 2rem;
    }

    .input-group {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    input, textarea {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
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

    .points-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .attribute-item, .skill-item, .ability-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      label {
        min-width: 120px;
        font-weight: bold;
      }
    }

    .point-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .point-button {
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 50%;
      background-color: #ecf0f1;

      &.selected {
        background-color: #3498db;
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

    .character-sheet {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;

      .basics, .stats {
        margin-bottom: 2rem;
      }

      h4 {
        margin-bottom: 1rem;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
      }

      p {
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class CharacterCreationComponent {
  currentStep: 'basics' | 'points' | 'sheet' = 'basics';
  currentQuestionIndex = 0;
  showError = false;

  characterBasics: CharacterBasics = {
    name: '',
    ancestry: '',
    appearance: '',
    background: '',
    goal: ''
  };

  // Attributes
  attributes = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
  attributePoints: AttributePoints = {};

  // Skills and Abilities
  skills: string[] = Array(8).fill('');
  abilities: string[] = Array(8).fill('');
  skillPoints: AttributePoints = {};
  abilityPoints: AttributePoints = {};

  remainingAttributePoints = 8;
  remainingSkillPoints = 8;

  constructor(private router: Router) {
    // Initialize attribute points
    this.attributes.forEach(attr => this.attributePoints[attr] = 0);
  }

  submitBasicInfo(field: keyof CharacterBasics) {
    if (!this.characterBasics[field]) {
      this.showError = true;
      return;
    }

    this.showError = false;
    if (this.currentQuestionIndex < 4) {
      this.currentQuestionIndex++;
    } else {
      this.currentStep = 'points';
    }
  }

  canAllocatePoint(item: string, points: number, type: 'attribute' | 'skill' | 'ability'): boolean {
    if (points > 2) return false;
    
    const currentPoints = type === 'attribute' 
      ? this.attributePoints[item] || 0
      : type === 'skill'
      ? this.skillPoints[item] || 0
      : this.abilityPoints[item] || 0;

    const pointDiff = points - currentPoints;
    
    if (pointDiff === 0) return true;
    if (pointDiff < 0) return true;

    const availablePoints = type === 'attribute'
      ? this.remainingAttributePoints
      : type === 'skill'
      ? this.remainingSkillPoints
      : Math.max(this.remainingAttributePoints, this.remainingSkillPoints);

    return pointDiff <= availablePoints;
  }

  allocatePoint(item: string, points: number, type: 'attribute' | 'skill' | 'ability') {
    if (!this.canAllocatePoint(item, points, type)) return;

    const currentPoints = type === 'attribute'
      ? this.attributePoints[item] || 0
      : type === 'skill'
      ? this.skillPoints[item] || 0
      : this.abilityPoints[item] || 0;

    const pointDiff = points - currentPoints;

    if (type === 'attribute') {
      this.attributePoints[item] = points;
      this.remainingAttributePoints -= pointDiff;
    } else if (type === 'skill') {
      this.skillPoints[item] = points;
      this.remainingSkillPoints -= pointDiff;
    } else {
      this.abilityPoints[item] = points;
      if (this.remainingAttributePoints >= pointDiff) {
        this.remainingAttributePoints -= pointDiff;
      } else {
        this.remainingSkillPoints -= pointDiff;
      }
    }
  }

  canShowCharacterSheet(): boolean {
    return this.remainingAttributePoints === 0 && this.remainingSkillPoints === 0;
  }

  showCharacterSheet() {
    if (this.canShowCharacterSheet()) {
      this.currentStep = 'sheet';
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  saveCharacter() {
    // Here we would typically save the character data
    this.router.navigate(['/']);
  }
} 