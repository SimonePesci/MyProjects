package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;
import static Flappy_Bird_Escape.View.IView.SceneWidth;


public class Cloud extends Rectangle {

    public Cloud(){

        super();
        this.setX(SceneWidth);

        Image cloudIM = new Image("file:" + IMAGE_PATH + "cloud.png");
        ImagePattern cloudIP = new ImagePattern(cloudIM);

        this.setFill(cloudIP);

    } // END CONSTRUCTOR


}   // END CLASS
