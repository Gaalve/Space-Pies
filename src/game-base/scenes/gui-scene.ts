/** Scene for user interface elements. */
import {PiCalcTests} from "../tests/pi-calc-tests";
import {TestEnvironment} from "../tests/test-environment";

export class GuiScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GuiScene",
            active: true
        })
    }

    create(): void {

        const roundPlayerText = this.add.text(1920/2, 50, 'P?!', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2});
        const roundNumberText = this.add.text(1920/2, 92, 'Round ?', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 32, fontStyle: 'bold' });
        const roundActionText = this.add.text(1920/2, 124, 'Action ?!', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 22 });
        let roundPlayerColor = "#4444FF";
        let roundPlayerStrokeColor = "#2222AA";
        this.scene.get('MainScene').data.events.on('changedata-round', (scene, value) => {
            roundNumberText.setText("Round " + value)
        });
        this.scene.get('MainScene').data.events.on('changedata-turnAction', (scene, value) => {
            roundActionText.setText(value)
        });
        this.scene.get('MainScene').data.events.on('changedata-currentPlayer', (scene, value) => {
            roundPlayerText.setText(value);
            roundPlayerColor = roundPlayerColor == "#FF4444" ? "#4444FF" : "#FF4444";
            roundPlayerStrokeColor = roundPlayerStrokeColor == "#AA2222" ? "#2222AA" : "#AA2222" ;
            roundPlayerText.setColor(roundPlayerColor);
            roundPlayerText.setStroke(roundPlayerStrokeColor, 4);
        });
        roundActionText.setTint(0xFF4500, 0xFF6347, 0xFF7F50, 0xFFD700);
        roundActionText.setOrigin(0.5, 0.5);
        roundNumberText.setOrigin(0.5, 0.5);
        roundPlayerText.setOrigin(0.5, 0.5);




        let te : TestEnvironment= new TestEnvironment(this, ()=>{});
        te.setOnFinishCallback(()=>{console.log("Pi-Calc-System working: "+te.didSucceed())});
        PiCalcTests.runTests(this, te);
    }

}
