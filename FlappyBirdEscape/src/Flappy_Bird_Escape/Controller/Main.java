package Flappy_Bird_Escape.Controller;

import javafx.application.Application;
import javafx.stage.Stage;


public class Main extends Application {

    public void start(Stage stage) {

        Controller.getInstance().createGameStage();

    }

    public static void main(String[] args) {

        launch(args);

    }

}

