package Flappy_Bird_Escape.View;

import Flappy_Bird_Escape.Model.Update;
import Flappy_Bird_Escape.View.Elements.*;
import javafx.animation.Animation;
import javafx.animation.FadeTransition;
import javafx.animation.TranslateTransition;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.media.AudioClip;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.paint.Color;
import javafx.scene.paint.Paint;
import javafx.scene.transform.Rotate;
import javafx.util.Duration;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;

import static Flappy_Bird_Escape.Controller.Controller.*;


public class View extends Group implements IView {


    // STATIC FIELDS                                                                                                                                        //


    // privates
    private static View instance = null;
    private static Scene scene ;

    private static Paint birdF = null;
    private static Paint weaponF ;

    //publics
    public static MediaPlayer musicP , gameOverP ;
    // END STATIC FIELDS                                                                                                                                     //


    // PRIVATE FIELDS                                                                                                                                       //
    private TextF scoreT , levelT , pauseT , winT , lostT , startF , restartT ;
    private Media shootS = new Media( new File(SOUNDS_PATH + "shotsEffect.mp3").toURI().toString() );
    private Media deadS = new Media( new File(SOUNDS_PATH + "ShotOrEgg_hit_enemy.mp3").toURI().toString() );
    private Media music = new Media( new File(SOUNDS_PATH + "Heroic-Intrusion.mp3").toURI().toString() ) ;
    private Media birdS = new Media( new File(SOUNDS_PATH + "birdintersectColumn.mp3").toURI().toString() ) ;
    private Media eggS = new Media( new File(SOUNDS_PATH + "eggsEffect.mp3").toURI().toString() ) ;
    private Media lostS = new Media( new File(SOUNDS_PATH + "Game Over Sound Effects High Quality .mp3").toURI().toString() ) ;
    private Media winS = new Media( new File(SOUNDS_PATH + "Epic Win - Sound Effect [HD] .mp3").toURI().toString() ) ;



    private ArrayList<TranslateTransition> translateTransitions = new ArrayList<>();                                                                                                                                                                                       //
    private ArrayList<Column> Columns = new ArrayList<>();
    private ArrayList<Ground> Grounds = new ArrayList<>(3);
    private ArrayList<Enemy> Enemies = new ArrayList<>();
    private ArrayList<Shot> Shots = new ArrayList<>();
    private ArrayList<Egg> Eggs = new ArrayList<>();
    private Bird bird ;
    private Weapon weapon ;
    private Cloud cloud ;
    // END PRIVATE FIELDS                                                                                                                                   //



    private View() {

        super();

        // Background

        BackGroundIM Background = new BackGroundIM();
        this.getChildren().add(Background);

        // Text to start

        startF = new TextF(30 , Color.ORANGE , "PRESS 'Enter' TO START " , (double)SceneWidth/2 - 200 , 550);
        setFadeTransition(startF);
        this.getChildren().add(startF);

        // Cloud

        cloud = new Cloud();
        this.getChildren().add(cloud);

        // Bird

        //bird = new Bird();
        bird = new Bird();
        if (birdF != null)
            bird.setFill( birdF );
        this.getChildren().add(bird);

        // Weapon

        weapon = new Weapon();
        weapon.setX( bird.getCenterX() );
        weapon.setY( bird.getCenterY() - 3 );
        if ( weaponF != null )
            weapon.setFill( weaponF );
        this.getChildren().add(weapon);

        //Ground

        Ground ground1 = new Ground(0);
        this.getChildren().add(ground1);
        Ground ground2 = new Ground( Ground.groundW);
        this.getChildren().add(ground2);
        Ground ground3 = new Ground( Ground.groundW*2 );
        this.getChildren().add(ground3);

        Grounds.add(ground1);
        Grounds.add(ground2);
        Grounds.add(ground3);

        // Score

        scoreT = new TextF(45 , Color.PURPLE , "Score : " + "0"  , 0 , 45);
        this.getChildren().add(scoreT);

        // Level

        levelT = new TextF(45 , Color.GREEN , "Level 1" , 0 , 90);
        this.getChildren().add(levelT);



        // Win text

        winT = new TextF(60 , Color.BLUE , "" , 50 , -100);

        // Game Paused

        pauseT = new TextF(80 , Color.YELLOW , " Game Paused" ,(double) SceneWidth/2 - 200 , 80 );

        // Lost text

        lostT = new TextF(50 , Color.RED , "" , -500 , 500) ;

        // Restart text

        restartT = new TextF(30 , Color.BLUE , "PRESS 'TAB' TO RESTART " , 300 ,550);

        setFadeTransition(restartT);

        // Add the menu to scene

        this.getChildren().add(menuT);



    }   // end constructor


    public void setColumnsSettings(double[] c1Set , double[] c2Set){


        Column c1 = new Column(true , c1Set );
        Column c2 = new Column(false , c2Set );

        this.getChildren().add(c1);
        this.getChildren().add(c2);

        Columns.add( c1 );
        Columns.add( c2 );

        // To prevent texts to be behind
        scoreT.toFront();
        levelT.toFront();

    }   // end method

    public void removeViewColumns(){

        Columns.remove(0);
        Columns.remove(0);


    }   // end method

    public void moveViewColumns( double x , int i ){

        Columns.get(i).setX( x );

    }   // end method

    public void setViewEnemiesSettings(double x , double y , boolean Up , boolean toWhere ) {

        Enemy enemy = new Enemy( Up , x , y );

        if( !Up ){

            TranslateTransition tt = Update.getInstance().horizontalTransition(toWhere);     //gets the corresponding Translation
            tt.setNode( enemy );
            translateTransitions.add(tt);
            tt.play();

        }

        else{

            TranslateTransition tt = Update.getInstance().verticalTransition(toWhere);      //gets the corresponding Translation
            tt.setNode( enemy );
            translateTransitions.add(tt);
            tt.play();

        }




        this.getChildren().add(enemy);

        Enemies.add(enemy);

        // To prevent texts to be behind
        scoreT.toFront();
        levelT.toFront();


    }   // end method

    public void moveViewEnemies( double x , double y , int i ){

        Enemies.get( i ).setX( x );
        Enemies.get( i ).setY( y );


    }   // end method

    public void removeViewEnemies(int removeIndex , boolean outOfWindow){

        this.getChildren().remove(Enemies.get(removeIndex) );
        Enemies.remove( removeIndex );
        translateTransitions.remove( removeIndex );     //removes the corresponding Translation

        if(!outOfWindow)
            soundEffect( "deadEnemy" );


    }   // end method

    public void setViewShotsSettings(double[] shotSettings , Rotate rotate){

        Shot shot = new Shot(rotate , shotSettings );

        this.getChildren().add(shot);

        Shots.add(shot);

        soundEffect("shoot");


    }   // end method

    public void moveViewShots( double[] shotMovement , int i , Rotate rotate) {

        Shots.get(i).getTransforms().clear();

        Shots.get(i).getTransforms().add( rotate );

        Shots.get(i).setX( shotMovement[0] );
        Shots.get(i).setY( shotMovement[1] );

    }   // end method

    public void removeViewShots( int removeIndex ){

        this.getChildren().remove(  Shots.get( removeIndex ) );
        Shots.remove( removeIndex );


    }   // end method

    public void setViewEggsSettings( double[] eggSettings ){

        Egg egg = new Egg();
        egg.setCenterX( eggSettings[0] );
        egg.setCenterY( eggSettings[1] );

        this.getChildren().add(egg);

        Eggs.add(egg);

        soundEffect("dropEgg") ;


    }   // end method

    public void moveViewEggs( double x , double y , int i ) {

        Eggs.get(i).setCenterX( x );
        Eggs.get(i).setCenterY( y );

    }   // end method

    public void removeViewEggs( int removeIndex ){

        this.getChildren().remove(  Eggs.get( removeIndex ) );
        Eggs.remove( removeIndex );


    }   // end method

    public void moveViewBirdNWeapon( double birdY , double[] weaponMovement , Rotate weaponRotate){

        bird.setCenterY( birdY );

        weapon.getTransforms().clear();

        weapon.getTransforms().add( weaponRotate );
        weapon.setX( weaponMovement[0] );
        weapon.setY( weaponMovement[1] );

    }   // end method

    public void moveViewGround(int i , double x){

        Grounds.get(i).setX( x );

    }   // end method

    public void moveViewCloud(double x , double y){

        cloud.setX( x );
        cloud.setY( y );

    }   // end method

    public void setCloudSettings(double width , double height){

        cloud.setWidth( width );
        cloud.setHeight( height );

    }   // end method

    public void showScore(int score){

        scoreT.setText("Score : "+ score);

    }   // END METHOD

    public void setLevel(int level){

        levelT.setText("Level " + level);

        if ( level == 2 )
            levelT.setFill(Color.YELLOW);

        if ( level == 3 )
            levelT.setFill(Color.RED);

    }   // END METHOD

    public void setPauseView(){

        for (TranslateTransition tt : translateTransitions){
            tt.pause();
        }

        musicP.pause();
        this.getChildren().add(pauseT);

    }   // END METHOD

    public void setResumeView(){

        for (TranslateTransition tt : translateTransitions){
            tt.play();
        }

        musicP.play();
        this.getChildren().remove(pauseT);

    }   // END METHOD

    public void viewOnGameWon(){

        removeAllViewShotsNEggs();

        gameOverSound(true);

        this.getChildren().remove(scoreT);
        winT.setText("CONGRATULATIONS!\nYOU WON WITH " + Update.getInstance().getScore() + "/200 POINTS");

        TranslateTransition winTT = new TranslateTransition(Duration.millis(500) ,  winT);
        winTT.setFromY( - 100 );
        winTT.setToY( 270 );
        winTT.play();

        this.getChildren().add(winT);
        this.getChildren().add(restartT);

    }   // END METHOD

    public void viewOnGameLost(){

        removeAllViewShotsNEggs();

        soundEffect("birdCollision");

        gameOverSound(false);

        birdNWeaponlostTransition();

        this.getChildren().remove(scoreT);
        lostT.setText("YOU LOST WITH " + Update.getInstance().getScore() + " POINTS , TRY AGAIN");

        TranslateTransition lostTT = new TranslateTransition(Duration.millis(500) ,  lostT);
        lostTT.setToX( 80 );
        lostTT.play();


        this.getChildren().add(lostT);
        this.getChildren().add(restartT);

    }   // END METHOD

    public void removeTextsAtStart(){

        this.getChildren().remove(startF);

        if (in1) {

            this.getChildren().remove(controlsT);
            in1 = false;
        }

        if (in2) {

            this.getChildren().remove(customizeT);
            in2 = false;
        }

        if (in3) {

            this.getChildren().remove(customizeWT);
            in3 = false;
        }

        this.getChildren().remove(menuT);


    }   // END METHOD

    public void customizeBird(String C){

        bird.setColor(C);
        birdF = bird.getFill();

    }   // END METHOD

    public void customizeW(String W){

        weapon.setWeapon(W);
        weaponF = weapon.getFill();

    }   // END METHOD

    private void soundEffect( String soundType){    // soundEffects

        if ( soundType.equals("deadEnemy") ){

            AudioClip effectsD = new AudioClip(deadS.getSource());
            effectsD.play();
        }

        if( soundType.equals("shoot") ){

            AudioClip effectsS = new AudioClip(shootS.getSource());
            effectsS.play();

        }

        if( soundType.equals("birdCollision") ){

            AudioClip effectsB = new AudioClip(birdS.getSource());
            effectsB.play();

        }

        if( soundType.equals("dropEgg") ){

            AudioClip effectsE = new AudioClip(eggS.getSource());
            effectsE.play();

        }



    }   // end method

    public void startMusic(){

        musicP = new MediaPlayer(music);
        musicP.play();


    }   // END METHOD

    private void gameOverSound(boolean win){

        musicP.stop();

        if( win ) {
            gameOverP = new MediaPlayer( winS );
        }
        else{
            gameOverP = new MediaPlayer( lostS );
        }

        gameOverP.play();


    }   // END METHOD


    public void createGameStage(){      // creates gameStage with this scene

        scene = new Scene(View.getInstance().getView() , SceneWidth ,SceneHeight);
        GameStage gameStage = new GameStage(scene);

    }   // END METHOD


    private void birdNWeaponlostTransition(){

        TranslateTransition bT = new TranslateTransition(Duration.millis( (SceneHeight/ (bird.getCenterY() + 60)  ) * 100 ) ); // proportional to the bird height ( + 60 to avoid SceneHeight/0 )
        bT.setNode( bird );
        bT.setToY( SceneHeight - groundHeight - bird.getCenterY() );
        bT.play();

        TranslateTransition wT = new TranslateTransition(Duration.millis( (SceneHeight/ (bird.getCenterY() + 60) ) * 100 ) );   // proportional to the bird height ( + 60 to avoid SceneHeight/0 )
        wT.setNode( weapon );
        wT.setToY( SceneHeight - groundHeight - weapon.getY() );
        wT.play();

    }   // END METHOD


    public void resetView(){

        instance = null;
        scene.setRoot( View.getInstance().getView() );

    }   // END METHOD

    public View getView(){

        return this;
    }   // END METHOD

    public void specificMenuToShow(TextF textF){    // Shows the specific menu

        this.getChildren().add(textF);
        this.getChildren().remove(menuT);

    }   // END METHOD

    public void goBackToMainMenuFrom(TextF textF){      // Shows the main menu

        this.getChildren().remove(textF);
        this.getChildren().add(menuT);

    }   // END METHOD


    private void removeAllViewShotsNEggs() {

        Iterator<Egg> eggsI = Eggs.iterator();
        Iterator<Shot> shotsI = Shots.iterator();

        while( eggsI.hasNext() ){

            Egg egg = eggsI.next();
            this.getChildren().remove(egg);

        }

        while( shotsI.hasNext() ){

            Shot shot = shotsI.next();
            this.getChildren().remove(shot);


        }

    }   // END METHOD

    private void setFadeTransition(Node node){      // Fade transition for start and restart texts

        FadeTransition ft = new FadeTransition(Duration.millis(500) , node);
        ft.setFromValue(1);
        ft.setToValue(0.4);
        ft.setAutoReverse(true);
        ft.setCycleCount(Animation.INDEFINITE);
        ft.play();

    }




    public static IView getInstance(){

        if( instance == null ){

            instance = new View();

        }

        return instance ;

    }   // end initialize instance



}   // end Flappy_Bird_Escape.View class
