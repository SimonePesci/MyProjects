package Flappy_Bird_Escape.Model.LogicalElements;

import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.SceneWidth;

public class LogicalCloud extends Rectangle {

    private int yCloud;

    public LogicalCloud(){

        super();

        yCloud = (int) (Math.random() * (350));

        this.setX(SceneWidth);
        this.setY(yCloud);
        this.setHeight( (int) (Math.random() * (50) ) + 100 );
        this.setWidth( (int) (Math.random() * (150)) + 150 );



    } // end constructor


    public void spawnCloud(){

        yCloud = (int) (Math.random() * (350) );

        this.setX( SceneWidth );
        this.setY( yCloud );
        this.setWidth( (int) (Math.random() * (150)) + 150 );
        this.setHeight( (int) (Math.random() * (50) ) + 100 );

    }

} // end class
