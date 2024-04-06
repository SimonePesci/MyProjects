package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;
import static Flappy_Bird_Escape.View.IView.SceneHeight;

public class Ground extends Rectangle {

    public static int groundW = 528;
    public static int Height = 100 ;

    public Ground(int spaceBG){

        super(groundW , Height );
        this.setY( SceneHeight - 100 );
        this.setX( spaceBG );
        Image groundIm = new Image("file:" + IMAGE_PATH + "ground.jpg");
        ImagePattern groundIp = new ImagePattern(groundIm);
        this.setFill(groundIp);

    }

}
