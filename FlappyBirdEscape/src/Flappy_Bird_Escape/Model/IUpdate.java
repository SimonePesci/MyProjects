package Flappy_Bird_Escape.Model;

import javafx.animation.TranslateTransition;

public interface IUpdate {

    void shoot();

    void dropEgg();

    void pauseGame();

    void resumeGame();

    void gameEnded();

    void setGameStarted() ;

    void restart();

    void setFrameJumpingTo0();

    void setJumpToTrue();

    int getScore();

    boolean isGameOver();

    boolean isGameStarted();

    boolean isGameEnded();

    TranslateTransition horizontalTransition(boolean toLeft);

    TranslateTransition verticalTransition(boolean toUp);




} // end interface
