package Flappy_Bird_Escape.View.Elements;

import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;
import javafx.scene.shape.Rectangle;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;

public class Weapon extends Rectangle {

    public Weapon() {

        super( 25 , 25 );

        Image weaponIMG = new Image("file:" + IMAGE_PATH + "fal.png");
        ImagePattern weaponIMGP = new ImagePattern(weaponIMG);
        this.setFill(weaponIMGP);


    }

    public void setWeapon(String w) {

        if( w.equals("D")){
            Image dmrI = new Image("file:" + IMAGE_PATH + "dmr.png");
            ImagePattern dmrIP = new ImagePattern(dmrI);
            this.setFill(dmrIP);
        }

        if( w.equals("M")){
            Image minigunI = new Image("file:" + IMAGE_PATH + "minigun.png");
            ImagePattern minigunIP = new ImagePattern(minigunI);
            this.setFill(minigunIP);
        }

        if( w.equals("F")){
            Image falI = new Image("file:" + IMAGE_PATH + "fal.png");
            ImagePattern falIP = new ImagePattern(falI);
            this.setFill(falIP);
        }


    } // end method


} // end class
