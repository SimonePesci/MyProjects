package Flappy_Bird_Escape.View;


import Flappy_Bird_Escape.View.Elements.TextF;
import javafx.scene.paint.Color;
import javafx.scene.transform.Rotate;

public interface IView  {

    int SceneHeight = 800 ;
    int SceneWidth = 900 ;

    int sizeC = 50 ;
    int sizeE = 50 ;
    int spaceInter = 200 ;

    int groundW = 528 ;
    int groundHeight = 100;

    TextF menuT = new TextF(40 , Color.BLUE , "Game menu \n          1- How to play \n           2- Customize bird \n            3- Customize weapon" , 0 , 180);
    TextF controlsT =  new TextF(40 , Color.BLUE ,"           SPACEBAR -> JUMP\n           MOVE MOUSE -> MOVE WEAPON\n           LEFT CLICK -> SHOOT\n           RIGHT CLICK -> DROP EGG\n           ESC -> PAUSE/RESUME GAME\n           TAB -> RESTART GAME\n            <- Click ''4'' to go back" , 0 , 140);
    TextF customizeT = new TextF(40 , Color.BLUE,"Click:\n            'R' for red bird\n            'B' for blue bird\n            'P' for purple bird\n            'G' for green bird\n            <- Click ''4'' to go back" , 300 ,140);
    TextF customizeWT = new TextF( 40 , Color.BLUE , "Click:\n            'F' for ''FAL''\n            'M' for ''MINIGUN''\n            'D' for ''DMR''\n            <- Click ''4'' to go back" , 300 , 140);

    String IMAGE_PATH = "Resources\\Images\\";
    String SOUNDS_PATH = "Resources\\Sounds\\";


    void setColumnsSettings( double[] c1Settings , double[] c2Settings );

    void removeViewColumns();

    void moveViewColumns( double x , int i );

    void setViewEnemiesSettings(double x , double y , boolean Up , boolean toWhere );

    void moveViewEnemies( double x , double y , int i );

    void removeViewEnemies(int removeIndex , boolean outOfWindow);

    void setViewShotsSettings(double[] shotSettings , Rotate rotate);

    void moveViewShots( double[] shotMovement , int i , Rotate rotate);

    void removeViewShots( int removeIndex ) ;

    void setViewEggsSettings( double[] eggSettings );

    void moveViewEggs( double x , double y , int i );

    void removeViewEggs( int removeIndex );

    void moveViewBirdNWeapon( double birdY , double[] weaponMovement , Rotate weaponRotate);

    void moveViewGround(int i , double x);

    void moveViewCloud(double x , double y);

    void setCloudSettings(double width , double height);

    void showScore(int score);

    void setLevel(int level);

    void setPauseView();

    void setResumeView();

    void viewOnGameWon();

    void viewOnGameLost();

    void removeTextsAtStart();

    void customizeBird(String C);

    void customizeW(String W);

    void startMusic();

    void resetView();

    View getView();

    void createGameStage();

    void specificMenuToShow(TextF textF);

    void goBackToMainMenuFrom(TextF textF);










}
