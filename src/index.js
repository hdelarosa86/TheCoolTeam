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
import { BattleScenePink, UIScenePink } from './phaser/battle/battlePink';
import { BattleSceneProf, UISceneProf } from './phaser/battle/battleProf';
import { BattleSceneEliot, UISceneEliot } from './phaser/battle/battleElliot';
import { BattleSceneKevin, UISceneKevin } from './phaser/battle/battleKevin';
import { BattleSceneRyan, UISceneRyan } from './phaser/battle/battleRyan';
import { BattleSceneRussell, UISceneRussell } from './phaser/battle/battleRussell';
import { BattleSceneMark, UISceneMark } from './phaser/battle/battleMark';


// console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 750,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },

  scene: [
    playGame,
    SceneTwo,
    SceneThree,
    SceneFour,
    SceneFive,
    SceneSix,
    BattleScene,
    UIScene,
    BattleSceneKevin,
    UISceneKevin,
    BattleScenePink,
    UIScenePink,
    BattleSceneProf,
    UISceneProf,
    BattleSceneEliot,
    UISceneEliot,
    BattleSceneRyan,
    UISceneRyan,
    BattleSceneRussell,
    UISceneRussell,
    BattleSceneMark,
    UISceneMark
  ],
}
const game = new Phaser.Game(config);


ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div'),
);

export default game;
