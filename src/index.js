import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App.jsx';
import { playGame } from './phaser/scene';
import SceneTwo from './phaser/sceneTwo';
import SceneThree from './phaser/sceneThree';
import SceneFour from './phaser/sceneFour';
import SceneFive from './phaser/sceneFive';
import SceneSix from './phaser/sceneSix';
import { BattleScene, UIScene } from './phaser/battle';


//console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 750,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [playGame, SceneTwo, SceneThree, SceneFour, SceneFive, SceneSix, BattleScene, UIScene]
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
);

export default game
