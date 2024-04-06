package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;
import javafx.scene.transform.Rotate;


public class LogicalShot extends Rectangle {

    public Rotate rotate;

    public LogicalShot(Rotate r) {

        super();
        this.setWidth(15);
        this.setHeight(2);

        this.rotate = r ;


    }

    public Rotate getRotation(){    return this.rotate;    } // end method

} //end class
