package Flappy_Bird_Escape.View.Elements;

import Flappy_Bird_Escape.Model.LogicalElements.LogicalColumn;
import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;

public class Column extends LogicalColumn {


    public Column(Boolean Up , double[] settings ) { // double x , double y , double height

        super(Up);

        this.setWidth( 50 );
        this.setX( settings[0] );
        this.setY( settings[1] );
        this.setHeight( settings[2] );





        if(Up){
            Image tuboUp = new Image("file:" + IMAGE_PATH + "tuboUp.png");
            ImagePattern ipTuboUp = new ImagePattern(tuboUp);
            this.setFill(ipTuboUp);

        }

        if(!Up) {
            Image tuboDown = new Image("file:" + IMAGE_PATH + "tuboDown.png");
            ImagePattern ipTuboDown = new ImagePattern(tuboDown);
            this.setFill(ipTuboDown);
        }

    } // end constructor

} // end class
