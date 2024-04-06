package Flappy_Bird_Escape.View.Elements;

import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontPosture;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class TextF extends Text {

    public TextF (int Dim , Color color , String s , double x , double y) {

        super();
        this.setFont(Font.font("impact", FontWeight.BOLD, FontPosture.REGULAR , Dim ));
        this.setText(s);
        this.setFill(color);
        this.setStroke(Color.BLACK);
        this.setStrokeWidth(2);
        this.setTranslateX( x );
        this.setTranslateY( y );

    } // end constructor


} // end class