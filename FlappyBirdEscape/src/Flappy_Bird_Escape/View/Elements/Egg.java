package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Ellipse;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;

public class Egg extends Ellipse {

    public Egg() {

        super(10 , 15);

        Image eggIM = new Image("file:" + IMAGE_PATH + "egg.png");
        ImagePattern eggIP = new ImagePattern(eggIM);
        this.setFill(eggIP);




    }   // end constructor

}   // end class
