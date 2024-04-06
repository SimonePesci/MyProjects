package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.Model.Update.spaceBSC;
import static Flappy_Bird_Escape.View.IView.*;

public class LogicalColumn extends Rectangle {

    private static int ColumnHeight  ;

    public LogicalColumn(Boolean Up) {

        super();
        this.setX(spaceBSC);

        this.setWidth( 50 );

        if(Up){
            ColumnHeight = (int) (Math.random() * (SceneHeight - 450) );
            this.setY( 0 );
            this.setHeight(ColumnHeight);

        }

        if(!Up) {
            this.setY( ColumnHeight + spaceInter );
            this.setHeight( SceneHeight - groundHeight - spaceInter - ColumnHeight);

        }

    } // end constructor

} // end class
