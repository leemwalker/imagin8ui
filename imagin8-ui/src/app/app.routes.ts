import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'new-game',
    loadComponent: () => 
      import('./components/new-game/new-game.component').then(m => m.NewGameComponent)
  },
  {
    path: 'create-character',
    loadComponent: () => 
      import('./components/character/character-creation.component').then(m => m.CharacterCreationComponent)
  },
  { path: '**', redirectTo: '' }
];
