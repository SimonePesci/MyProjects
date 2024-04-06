package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.*;


public class LogicalGround extends Rectangle {

    public LogicalGround(){

        super(groundW , groundHeight);
        this.setY( SceneHeight - 100 );

    }   // end constructor


} // end class
