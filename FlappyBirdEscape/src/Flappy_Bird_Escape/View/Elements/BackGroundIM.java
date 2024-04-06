package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.*;


public class BackGroundIM extends Rectangle {

    public BackGroundIM(){

        super(SceneWidth + 500, SceneHeight);
        Image BackIM = new Image("file:" + IMAGE_PATH + "Background.jpg");
        ImagePattern BackIP = new ImagePattern(BackIM);
        this.setFill(BackIP);


    }

}
