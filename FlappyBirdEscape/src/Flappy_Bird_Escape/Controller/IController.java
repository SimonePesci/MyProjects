package Flappy_Bird_Escape.Controller;

import javafx.scene.input.MouseEvent;


public interface IController {

    void onLeftClick();

    void onRightClick();

    void onKeyPressed(String KeyPressed);

    void onMouseMoved(MouseEvent E);

    void createGameStage();

}