package Flappy_Bird_Escape.View.Elements;

import Flappy_Bird_Escape.Model.LogicalElements.LogicalEnemy;
import javafx.scene.image.Image;
import javafx.scene.paint.ImagePattern;

import static Flappy_Bird_Escape.View.IView.IMAGE_PATH;


public class Enemy extends LogicalEnemy {


    public Enemy(Boolean Up , double x , double y ) {

        super( Up );

        this.setX( x );
        this.setY( y );



        if( Up ){

            Image enemyImC = new Image("file:" + IMAGE_PATH + "ghostlv3.png");
            ImagePattern enemyIPC = new ImagePattern(enemyImC);

            this.setFill(enemyIPC);

        }

        else{

            Image enemyIm = new Image("file:" + IMAGE_PATH + "ghost.png");
            ImagePattern enemyIP = new ImagePattern(enemyIm);

            this.setFill(enemyIP);

        }



    }



}
