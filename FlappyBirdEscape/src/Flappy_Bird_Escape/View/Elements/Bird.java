package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Ellipse;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;

public class Bird extends Ellipse {

    public Bird(){

        super(40 , 40);
        this.setCenterX(250); // X pos
        this.setCenterY(350); // Y pos

        Image BirdIM = new Image("file:" + IMAGE_PATH + "birdFrameRed.png"); // red
        ImagePattern BirdIP = new ImagePattern(BirdIM);

        this.setFill(BirdIP);

        this.setRadiusX((BirdIM.getWidth()/2)+2);
        this.setRadiusY((BirdIM.getHeight()/2)+2);

    }

    public void setColor(String color){

        if(color.equals("P")){
            Image BirdIMP = new Image("file:" + IMAGE_PATH + "birdFramePurple.png"); // purple
            ImagePattern BirdIPP = new ImagePattern(BirdIMP);
            this.setFill(BirdIPP);
        }

        if(color.equals("B")){
            Image BirdIMB = new Image("file:" + IMAGE_PATH + "birdFrameBlue.png"); // blue
            ImagePattern BirdIPB = new ImagePattern(BirdIMB);
            this.setFill(BirdIPB);
        }

        if(color.equals("R")){
            Image BirdIMR = new Image("file:" + IMAGE_PATH + "birdFrameRed.png"); // red
            ImagePattern BirdIPR = new ImagePattern(BirdIMR);
            this.setFill(BirdIPR);
        }

        if(color.equals("G")){
            Image BirdIMG = new Image("file:" + IMAGE_PATH + "birdFrameGreen.png"); // green
            ImagePattern BirdIPG = new ImagePattern(BirdIMG);
            this.setFill(BirdIPG);
        }


    } //end setColor


}
