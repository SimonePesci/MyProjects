package Flappy_Bird_Escape.Controller;

import Flappy_Bird_Escape.Model.Update;
import Flappy_Bird_Escape.View.*;
import javafx.scene.input.MouseEvent;


import static Flappy_Bird_Escape.Model.Update.*;
import static Flappy_Bird_Escape.View.IView.*;
import static Flappy_Bird_Escape.View.View.*;


public class Controller implements IController{



    // STATIC FIELDS                                //
    private static Controller instance = null;

    public static double xMouse = 0;
    public static double yMouse = 0;

    public static boolean in1 = false;
    public static boolean in2 = false;
    public static boolean in3 = false;
    // END STATIC FIELDS                            //


    // PRIVATE FIELDS
    private boolean inPause = false ;



    public void createGameStage(){

        View.getInstance().createGameStage();

    }   // END METHOD

    @Override
    public void onLeftClick() {

        if ( Update.getInstance().isGameStarted() && !Update.getInstance().isGameOver() && !inPause && !Update.getInstance().isGameEnded() ) {        //E.isPrimaryButtonDown()

            Update.getInstance().shoot();

        }

    }   // END left click METHOD

    @Override
    public void onRightClick() {

        if ( Update.getInstance().isGameStarted() && !Update.getInstance().isGameOver() && !inPause && !Update.getInstance().isGameEnded() ) {      //E.isSecondaryButtonDown()

            Update.getInstance().dropEgg();

        }

    }   // END right click METHOD

    @Override
    public void onKeyPressed(String KeyPressed) {

        if (!Update.getInstance().isGameStarted() ) {

            if (KeyPressed.equals("ENTER")) {        // Game is started

                Update.getInstance().setGameStarted();
                View.getInstance().removeTextsAtStart();
                View.getInstance().startMusic();

            }

        }   // end starting game

        if( !Update.getInstance().isGameStarted() ) {

            if (KeyPressed.equals("DIGIT1") && !in1 && !in2 && !in3 ) {

                View.getInstance().specificMenuToShow(controlsT);
                in1 = true;

            } else if (KeyPressed.equals("DIGIT2") && !in1 && !in2 && !in3 ) {

                View.getInstance().specificMenuToShow(customizeT);
                in2 = true;

            } else if (KeyPressed.equals("DIGIT3") && !in1 && !in2 && !in3 ) {

                View.getInstance().specificMenuToShow(customizeWT);
                in3 = true;

            }

            if (in1 || in2 || in3) {

                if (KeyPressed.equals("DIGIT4")) {

                    if (in1) {

                        View.getInstance().goBackToMainMenuFrom(controlsT);
                        in1 = false;

                    } else if (in2) {

                        View.getInstance().goBackToMainMenuFrom(customizeT);
                        in2 = false;

                    } else {

                        View.getInstance().goBackToMainMenuFrom(customizeWT);
                        in3 = false;

                    }


                }

                if (in2) {
                    View.getInstance().customizeBird(KeyPressed);
                }

                if (in3) {
                    View.getInstance().customizeW(KeyPressed);
                }

            } // end go back to menu

        }

        if ( Update.getInstance().isGameStarted() ) {

            if (KeyPressed.equals("SPACE")) {

                Update.getInstance().setJumpToTrue();          // Jump starts
                Update.getInstance().setFrameJumpingTo0();            // Resets FrameJumping

            }




            if (KeyPressed.equals("TAB")) {        // Restart game


                if (Update.getInstance().isGameOver() || Update.getInstance().isGameEnded())
                    gameOverP.stop();
                else
                    musicP.stop();

                updateTime.stop();


                Update.getInstance().restart();
                View.getInstance().resetView();

            }

            if (KeyPressed.equals("ESCAPE") && !inPause && !Update.getInstance().isGameOver() && Update.getInstance().isGameStarted() && !Update.getInstance().isGameEnded()) {

                Update.getInstance().pauseGame();
                inPause = true;


            } else if (KeyPressed.equals("ESCAPE") && inPause && !Update.getInstance().isGameOver() && Update.getInstance().isGameStarted() && !Update.getInstance().isGameEnded()) {

                Update.getInstance().resumeGame();
                inPause = false;

            }

        }


    }   // end setOnKeyPressed



    @Override
    public void onMouseMoved(MouseEvent E) {

        // Gets mouse coordinates
        xMouse = E.getX();
        yMouse = E.getY();

    }   // end mouse moved

    public static IController getInstance(){

        if( instance == null)
            instance = new Controller();

        return instance;

    }   // end instance controller


}   // end Flappy_Bird_Escape.Controller.Controller class
