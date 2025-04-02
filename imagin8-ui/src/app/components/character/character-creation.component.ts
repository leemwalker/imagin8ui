import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService, GameSetup } from '../../services/game-state.service';

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
      <h2>Create Your Character</h2>
      
      <div class="creation-form" *ngIf="currentStep !== 'sheet'">
        <!-- Basic Information Section -->
        <div class="question" *ngIf="currentStep === 'basics'">
          <h3>What is your Name?</h3>
          <div class="input-group">
            <input type="text" (keydown.enter)="submitBasicInfo('name')" [(ngModel)]="characterBasics.name" placeholder="Enter character name...">
          </div>
          <br>
          <button (click)="submitBasicInfo('name')" [disabled]="!characterBasics.name">Next</button>
          <p class="error" *ngIf="showError">Please provide a name before continuing.</p>
        </div>

        <div class="question" *ngIf="currentStep === 'ancestry'">
          <h3>What is your character's ancestry?</h3>
          <div class="input-group">
            <select 
              *ngIf="gameSetup?.ancestries?.length"
              [(ngModel)]="characterBasics.ancestry" 
              class="ancestry-select">
              <option value="">Select an ancestry...</option>
              <option *ngFor="let ancestry of gameSetup?.ancestries" [value]="ancestry">
                {{ancestry}}
              </option>
            </select>
            <input 
              *ngIf="!gameSetup?.ancestries?.length"
              type="text" 
              (keydown.enter)="nextStep()"
              [(ngModel)]="characterBasics.ancestry" 
              placeholder="Enter your ancestry...">
          </div>
          <br>
          <button (click)="nextStep()" [disabled]="!characterBasics.ancestry">Next</button>
        </div>

        <div class="question" *ngIf="currentStep === 'appearance'">
          <h3>What do you look like?</h3>
          <div class="input-group">
            <textarea [(ngModel)]="characterBasics.appearance" placeholder="Describe your character's appearance..."></textarea>
          </div>
          <br>
          <button (click)="submitBasicInfo('appearance')" [disabled]="!characterBasics.appearance">Next</button>
          <p class="error" *ngIf="showError">Please provide an appearance description before continuing.</p>
        </div>

        <div class="question" *ngIf="currentStep === 'background'">
          <h3>What is your Background?</h3>
          <p><i>Asteroid miner? Social Climber?</i></p>
          <div class="input-group">
            <input type="text" (keydown.enter)="submitBasicInfo('background')" [(ngModel)]="characterBasics.background" placeholder="Enter background...">
          </div>
          <br>
          <button (click)="submitBasicInfo('background')" [disabled]="!characterBasics.background">Next</button>
          <p class="error" *ngIf="showError">Please provide a background before continuing.</p>
        </div>

        <div class="question" *ngIf="currentStep === 'goal'">
          <h3>What is your goal/ambition?</h3>
          <div class="input-group">
            <textarea (keydown.enter)="submitBasicInfo('goal')" [(ngModel)]="characterBasics.goal" placeholder="Describe your character's goals..."></textarea>
          </div>
          <br>
          <button (click)="submitBasicInfo('goal')" [disabled]="!characterBasics.goal">Next</button>
          <p class="error" *ngIf="showError">Please provide a goal before continuing.</p>
        </div>

        <!-- Attributes Selection -->
        <div class="question" *ngIf="currentStep === 'attributes'">
          <h3>What are your character's attributes?</h3>
          <p><i>These are the attributes that your character is born with and are split into physical, mental, and sensory categories.</i></p>
          <br>
          <div class="attributes-section">
            <div class="attributes-list">
              <h2>Physical</h2>
              <div class="phys-attribute-item" *ngFor="let attr of phys_attributes; let i = index; trackBy:trackByFn">">
                <input type="text" [(ngModel)]="phys_attributes[i]" placeholder="Enter physical attribute name...">
              </div>
              <h2>Mental</h2>
              <div class="ment-attribute-item" *ngFor="let attr of ment_attributes; let i = index; trackBy:trackByFn">">
                <input type="text" [(ngModel)]="ment_attributes[i]" placeholder="Enter mental attribute name...">
              </div>
              <h2>Sensory</h2>
              <div class="sense-attribute-item" *ngFor="let attr of sens_attributes; let i = index; trackBy:trackByFn">">
                <input type="text" [(ngModel)]="sens_attributes[i]" placeholder="Enter sensory attribute name...">
              </div>
            </div>
          </div>
          <br>
          <button (click)="nextStep()">Next</button>
        </div>
        
        <!-- Skills Selection -->
        <div class="question" *ngIf="currentStep === 'skills'">
          <h3>What are some things that your character is good at?</h3>
          <p><i>These can be things they are naturally gifted at such as being a talented swimmer or things they have trained at such as a specific martial art.</i></p>
          <br>
          <div class="skills-section">
            <div class="skill-list">
              <div class="skill-item" *ngFor="let skill of skills; let i = index; trackBy:trackByFn">
                <input type="text" [(ngModel)]="skills[i]" placeholder="Enter skill name...">
              </div>
            </div>
          </div>
          <br>
          <button (click)="nextStep()">Next</button>
        </div>

        <!-- Abilities Selection -->
        <div class="question" *ngIf="currentStep === 'abilities'">
          <h3>Does your character have any extraordinary abilities?</h3>
          <p><i>These can be superpowers such as flight or super strength or the ability to use magic.</i></p>
          <br>
          <div class="skills-section">
            <div class="skill-list">
              <div class="skill-item" *ngFor="let skill of skills; let i = index; trackBy:trackByFn">
                <input type="text" [(ngModel)]="skills[i]" placeholder="Enter skill name...">
              </div>
            </div>
          </div>
          <br>
          <button (click)="nextStep()">Next</button>
        </div>

      <!-- Character Sheet View -->
      <div class="section" *ngIf="currentStep === 'sheet'">
        <h3>Character Sheet</h3>
        
        <div class="character-sheet">
          <!-- Game Setup Information -->
          <div class="game-setup" *ngIf="gameSetup">
            <h4>Game Information</h4>
            <p><strong>Genre:</strong> {{gameSetup.genre}} - {{gameSetup.subGenre}}</p>
            <p><strong>Tone:</strong> {{gameSetup.tone}}</p>
            <p><strong>Setting:</strong> {{gameSetup.setting}}</p>
            <p><strong>Plot Style:</strong> {{gameSetup.plot}}</p>
            <p><strong>Game Style:</strong> {{getGameStyleDescription(gameSetup.style)}}</p>
            <p><strong>Storyteller:</strong> {{gameSetup.storyteller}}</p>
          </div>

          <!-- Character Information -->
          <div class="basics">
            <h4>Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Name:</label>
                <span>{{characterBasics.name}}</span>
              </div>
              <div class="info-item">
                <label>Ancestry:</label>
                <span>{{characterBasics.ancestry}}</span>
              </div>
              <div class="info-item">
                <label>Appearance:</label>
                <span>{{characterBasics.appearance}}</span>
              </div>
              <div class="info-item">
                <label>Background:</label>
                <span>{{characterBasics.background}}</span>
              </div>
              <div class="info-item">
                <label>Goal:</label>
                <span>{{characterBasics.goal}}</span>
              </div>
            </div>
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
              <div class="tag-list">
                <span class="tag" *ngFor="let skill of getSelectedSkills()">{{skill}}</span>
              </div>
            </div>

            <div class="abilities">
              <h4>Abilities</h4>
              <div class="tag-list">
                <span class="tag" *ngFor="let ability of getSelectedAbilities()">{{ability}}</span>
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

    .skills-selection,
    .abilities-selection {
      margin: 1rem 0;
    }

    .predefined-skills,
    .predefined-abilities,
    .custom-skills,
    .custom-abilities {
      margin-bottom: 1.5rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }

      label {
        cursor: pointer;
      }
    }

    .input-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    select {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: white;
    }

    .game-setup {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: var(--background-color);
      border-radius: 4px;
    }
  `]
})
export class CharacterCreationComponent implements OnInit {
  gameSetup: GameSetup | null = null;
  currentStep: 'basics' | 'ancestry' | 'appearance' | 'background' | 'goal' | 'skills' | 'abilities' | 'points' | 'sheet' = 'basics';
  showError = false;

  characterBasics: CharacterBasics = {
    name: '',
    ancestry: '',
    appearance: '',
    background: '',
    goal: ''
  };

  // Skills and Abilities
  allSkills: string[] = [];
  allAbilities: string[] = [];

  // Attributes
  attributes = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
  attributePoints: AttributePoints = {};
  skillPoints: AttributePoints = {};
  abilityPoints: AttributePoints = {};

  remainingAttributePoints = 8;
  remainingSkillPoints = 8;

  // Add missing properties
  newSkill: string = '';
  newAbility: string = '';
  newAttribute: string = '';
  skills: string[] = Array(8).fill('');
  abilities: string[] = Array(8).fill('');
  phys_attributes: string[] = Array(8).fill('');
  ment_attributes: string[] = Array(8).fill('');
  sens_attributes: string[] = Array(8).fill('');

  trackByFn(index: any, item: any) {
    return index;
  }

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {
    this.attributes.forEach(attr => this.attributePoints[attr] = 0);
  }

  ngOnInit() {
    // Get game setup if available, but don't require it
    this.gameSetup = this.gameStateService.getGameSetup();
    
    // Initialize skills and abilities from game setup if available
    if (this.gameSetup) {
      this.allSkills = [...this.gameSetup.skills];
      this.allAbilities = [...this.gameSetup.abilities];
    }

  }

  submitBasicInfo(field: keyof CharacterBasics) {
    if (!this.characterBasics[field]) {
      this.showError = true;
      return;
    }

    this.showError = false;
    this.nextStep();
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

  nextStep() {
    switch (this.currentStep) {
      case 'basics':
        this.currentStep = 'ancestry';
        break;
      case 'ancestry':
        this.currentStep = 'appearance';
        break;
      case 'appearance':
        this.currentStep = 'background';
        break;
      case 'background':
        this.currentStep = 'goal';
        break;
      case 'goal':
        this.currentStep = 'skills';
        break;
      case 'skills':
        this.currentStep = 'abilities';
        break;
      case 'abilities':
        this.currentStep = 'points';
        break;
      default:
        break;
    }
  }

  addCustomSkill() {
    if (this.newSkill.trim()) {
      this.newSkill = '';
    }
  }

  addCustomAbility() {
    if (this.newAbility.trim()) {
      this.newAbility = '';
    }
  }

  getGameStyleDescription(style: number): string {
    switch (style) {
      case 1: return 'Combat Heavy';
      case 2: return 'Combat Focused';
      case 3: return 'Balanced';
      case 4: return 'Roleplay Focused';
      case 5: return 'Pure Roleplay';
      default: return 'Balanced';
    }
  }
} 