package Flappy_Bird_Escape.View.Elements;

import Flappy_Bird_Escape.Model.LogicalElements.LogicalShot;
import javafx.scene.paint.Color;
import javafx.scene.transform.Rotate;

public class Shot extends LogicalShot {

    public Rotate rotation;

    public Shot(Rotate rotate , double[] shotSettings){

        super(rotate);
        this.setWidth( shotSettings[0] );
        this.setHeight( shotSettings[1] );
        this.setX( shotSettings[2] );
        this.setY( shotSettings[3] );

        Color yellow = Color.YELLOW;
        this.setFill(yellow);
        this.rotation = rotate ;


    } //end constructor


} // end class
