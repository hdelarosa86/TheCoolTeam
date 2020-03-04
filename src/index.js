import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App.jsx';
import { playGame } from './phaser/scenery/scene';
import SceneTwo from './phaser/scenery/sceneTwo';
import SceneThree from './phaser/scenery/sceneThree';
import SceneFour from './phaser/scenery/sceneFour';
import SceneFive from './phaser/scenery/sceneFive';
import SceneSix from './phaser/scenery/sceneSix';
import { BattleScene, UIScene } from './phaser/battle/battle';


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
