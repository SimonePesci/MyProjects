package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;

public class LogicalWeapon extends Rectangle {

    public LogicalWeapon(){

        super( 25 , 25 );

        this.setX(250); // same as bird
        this.setY( 347 ); // birdY - 2

    }

}
