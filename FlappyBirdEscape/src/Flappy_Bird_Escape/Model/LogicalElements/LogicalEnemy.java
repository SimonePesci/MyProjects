package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;

public class LogicalEnemy extends Rectangle {

    boolean isUp;
    boolean isGoingUpOrLeft ;

    public LogicalEnemy(Boolean Up){

        super(50 , 50);
        this.isUp = Up ;
        this.isGoingUpOrLeft = true;

    }



}
