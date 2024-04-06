package Flappy_Bird_Escape.View;


import Flappy_Bird_Escape.Controller.Controller;
import javafx.scene.Scene;
import javafx.stage.Stage;


public class GameStage extends Stage {

    public GameStage(Scene scene) {

        super();
        this.setTitle(" Flappy Bird Escape ");
        this.setResizable(false);
        this.setX( 500 );
        this.setY(100);

        this.setScene(scene);

        this.getScene().setOnMousePressed( E -> {   // Mouse clicks

            if (E.isPrimaryButtonDown())
                Controller.getInstance().onLeftClick();
            else
                Controller.getInstance().onRightClick();

        } );


        this.getScene().setOnMouseMoved( E ->       // Mouse moved

                Controller.getInstance().onMouseMoved(E)

        );

        this.getScene().setOnKeyPressed( E -> {     // KeyPressed

            String KeyPressed = E.getCode().toString();
            Controller.getInstance().onKeyPressed( KeyPressed );

        });

        this.show();

    } // END CONSTRUCTOR


}   // END CLASS
