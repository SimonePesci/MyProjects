package Flappy_Bird_Escape.Model;


import Flappy_Bird_Escape.Model.LogicalElements.*;
import Flappy_Bird_Escape.View.View;
import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;

import javafx.animation.TranslateTransition;
import javafx.scene.shape.Rectangle;
import javafx.scene.transform.Rotate;

import javafx.util.Duration;

import java.util.ArrayList;
import java.util.Iterator;

import static Flappy_Bird_Escape.Controller.Controller.*;
import static Flappy_Bird_Escape.View.View.*;
import static java.lang.StrictMath.atan;


public class Update implements IUpdate {

    // STATIC FIELDS
    private static Update instance = null;

    private static double angle = 0 ;       // mouse angle to rotate
    private static Rotate rotate = new Rotate(angle , 250 , 347 ) ; // Rotation : setted with weapon coordinates
    private static boolean jump = false;    // is bird jumping

    private final static int spaceBC = 350;
    public static int spaceBSC = 450; // space between spawned columns

    public static Timeline updateTime ;
    // END STATIC FIELDS

    // PRIVATE FIELDS
    private int gameSpeed ;
    private int score ;
    private boolean gameEnded;
    private boolean gameOver;
    private boolean gameStarted;
    private int frameJumping = 0 ; // every 'x' ms 1 frameJumping while jump = true
    private int columnsPassed ;

    private ArrayList<LogicalColumn> LogicalColumns = new ArrayList<>() ;
    private ArrayList<LogicalEnemy> logicalEnemies = new ArrayList<>() ;
    private ArrayList<LogicalShot> LogicalShots = new ArrayList<>() ;
    private ArrayList<LogicalEgg> LogicalEggs = new ArrayList<>();
    private ArrayList<LogicalGround> LogicalGrounds = new ArrayList<>(3);
    private ArrayList<TranslateTransition> translateTransitions = new ArrayList<>();
    private LogicalWeapon logicalWeapon = new LogicalWeapon();
    private LogicalCloud logicalCloud = new LogicalCloud();
    private LogicalBird logicalBird = new LogicalBird();
    private Rectangle checkRect = new Rectangle(SceneWidth , SceneHeight - groundHeight);




    public Update(){

        this.score = 0;
        this.gameEnded = false ;
        this.gameOver = false;
        this.gameStarted = false ;
        this.gameSpeed = 4 ;
        this.columnsPassed = 0;


        LogicalGround ground1 = new LogicalGround();
        LogicalGround ground2 = new LogicalGround();
        ground2.setX(groundW);

        LogicalGround ground3 = new LogicalGround();
        ground3.setX(groundW*2);

        LogicalGrounds.add(ground1);
        LogicalGrounds.add(ground2);
        LogicalGrounds.add(ground3);

        View.getInstance().setCloudSettings(logicalCloud.getWidth() , logicalCloud.getHeight() );

        addColumns(4);

        KeyFrame updateFrame = new KeyFrame(Duration.millis(16), U -> {

            OBJMovements();             // 1- Move objects

            checks();                   // 2- checks bounds/collisions

            setScoreColumnsPassed();     // 3- setScore


            if (this.gameOver) {        // 4- stop if game is lost
                updateTime.stop();
            }


        });


        updateTime = new Timeline(updateFrame);
        updateTime.setCycleCount(Animation.INDEFINITE);


    } // end constructor


    private void columnsM(){


        for(int i = 0; i < LogicalColumns.size() ; i++){

            double X = LogicalColumns.get(i).getX() ;
            LogicalColumns.get(i).setX(X - this.gameSpeed);
            View.getInstance().moveViewColumns( LogicalColumns.get(i).getX() , i );

        }

    } //end method

    private void enemyBaseM(){

        for (int i = 0 ; i < logicalEnemies.size() ; i++){

            double X = logicalEnemies.get(i).getX();
            logicalEnemies.get(i).setX(X - this.gameSpeed);

            View.getInstance().moveViewEnemies( logicalEnemies.get(i).getX() , logicalEnemies.get(i).getY() , i);

        } // end for enemies

    } // end method


    private void birdNWeaponM(){

        if(jump){   // if bird is jumping
            frameJumping++;

            logicalWeapon.getTransforms().remove(rotate);

            logicalBird.setCenterY( logicalBird.getCenterY() - 6 );

            logicalWeapon.setY( logicalBird.getCenterY() - 3 );

            rotate.setPivotY( logicalWeapon.getY() );

            logicalWeapon.getTransforms().add(rotate);

            double[] weaponMovement = new double[2];    // Coordinates to View
            weaponMovement[0] = logicalWeapon.getX();
            weaponMovement[1] = logicalWeapon.getY();

            View.getInstance().moveViewBirdNWeapon( logicalBird.getCenterY() , weaponMovement , rotate);


            if (frameJumping %10 == 0){
                jump = false;
            }

        }

        if(!jump){  // if bird is falling

            logicalWeapon.getTransforms().remove(rotate);

            logicalBird.setCenterY( logicalBird.getCenterY() + 5 );

            logicalWeapon.setY( logicalBird.getCenterY() - 3 );

            rotate.setPivotY( logicalWeapon.getY() );

            logicalWeapon.getTransforms().add(rotate);

            double[] weaponMovement = new double[2];    // Coordinates to View
            weaponMovement[0] = logicalWeapon.getX();
            weaponMovement[1] = logicalWeapon.getY();

            View.getInstance().moveViewBirdNWeapon( logicalBird.getCenterY() , weaponMovement , rotate);

        }

    } // end method

    private void groundM(){


        for(int i = 0; i < LogicalGrounds.size() ; i++){

            if ( LogicalGrounds.get(i).getX() + groundW <= 0 ){

                LogicalGrounds.get(i).setX( LogicalGrounds.get(i).getX() + (groundW * 3) );

            }

            LogicalGrounds.get(i).setX( LogicalGrounds.get(i).getX() - this.gameSpeed );

            View.getInstance().moveViewGround(i , LogicalGrounds.get(i).getX() );

        }   // end cycle


    } // end method

    private void cloudM(){

        logicalCloud.setX(logicalCloud.getX() - this.gameSpeed + 3);

        if (( logicalCloud.getX() + logicalCloud.getWidth()) < 0) {

            logicalCloud.spawnCloud();
            View.getInstance().setCloudSettings( logicalCloud.getWidth() , logicalCloud.getHeight() );

        } // end spawn cloud

        View.getInstance().moveViewCloud( logicalCloud.getX() , logicalCloud.getY() );

    } // end method cloud



    private void shotM(){

        for(int i = 0; i < LogicalShots.size() ; i++){

            Rotate shotRotation = LogicalShots.get(i).getRotation();

            LogicalShots.get(i).getTransforms().remove( shotRotation );

            LogicalShots.get(i).setX( LogicalShots.get(i).getX() - this.gameSpeed );

            shotRotation.setPivotX( shotRotation.getPivotX() - this.gameSpeed );

            LogicalShots.get(i).getTransforms().add( shotRotation );

            LogicalShots.get(i).setX( LogicalShots.get(i).getX() + 14 );

            double[] shotMovement = new double[2];    // Coordinates to View
            shotMovement[0] = LogicalShots.get(i).getX();
            shotMovement[1] = LogicalShots.get(i).getY();

            View.getInstance().moveViewShots( shotMovement , i , shotRotation );

        }

    } // end method

    private void eggM(){

        for(int i = 0; i < LogicalEggs.size() ; i++){

            LogicalEggs.get(i).setCenterX( LogicalEggs.get(i).getCenterX() - this.gameSpeed );

            LogicalEggs.get(i).setCenterY( LogicalEggs.get(i).getCenterY() + this.gameSpeed + 6 );

            View.getInstance().moveViewEggs( LogicalEggs.get(i).getCenterX() , LogicalEggs.get(i).getCenterY() , i );

        }

    } // end method

    private void weaponRotate(){


        double newX = xMouse - logicalBird.getCenterX();
        double newY = logicalBird.getCenterY() - yMouse;


        angle = -atan(newY / newX);
        angle = Math.toDegrees(angle);



        if (newX < 0) {

            angle = 180 + angle;

        }

        logicalWeapon.getTransforms().remove(rotate);

        rotate = new Rotate(angle, logicalWeapon.getX(), logicalWeapon.getY());

        logicalWeapon.getTransforms().add(rotate);

    } // end method

    private void OBJMovements(){

        columnsM();
        enemyBaseM();
        birdNWeaponM();
        weaponRotate();
        groundM();
        cloudM();
        shotM();
        eggM();

    }    //end method

    public void addColumns(int addCount){

        if(addCount > 1)
            spaceBSC = 1000;

        for(int i = 0; i < addCount ; i++) {

            if(addCount > 1)
                spaceBSC = spaceBSC + 450;
            if(addCount == 1)
                spaceBSC = 450 * 4;

            LogicalColumn c1 = new LogicalColumn(true);
            LogicalColumn c2 = new LogicalColumn(false);

            LogicalColumns.add(c1);
            LogicalColumns.add(c2);

            double[] c1Pos = new double[3];    // Coordinates to View
            double[] c2Pos = new double[3];    // Coordinates to View
            c1Pos[0] = c1.getX();
            c1Pos[1] = c1.getY();
            c1Pos[2] = c1.getHeight();
            c2Pos[0] = c2.getX();
            c2Pos[1] = c2.getY();
            c2Pos[2] = c2.getHeight();

            View.getInstance().setColumnsSettings( c1Pos , c2Pos );

        }

    }   // end method


    private void addEnemy(){

        if ( (this.columnsPassed) >= 20 ) {

            if ( this.columnsPassed == 20 )
                setGameInfo(2);

            int randGroundEnemy = (int) (Math.random() * (spaceBC - sizeC - sizeE )) ;

            LogicalEnemy logicalEnemy = new LogicalEnemy(false);
            logicalEnemy.setX(spaceBSC - randGroundEnemy - sizeE);
            logicalEnemy.setY(SceneHeight - groundHeight - sizeE);

            logicalEnemies.add(logicalEnemy);

            boolean toLeft = true;

            if( LogicalColumns.get( LogicalColumns.size() - 1 ).getX() - logicalEnemy.getX() < 200  ) {

                TranslateTransition tt = horizontalTransition(true);
                tt.setNode( logicalEnemy );
                tt.play();

            } else {

                TranslateTransition tt = horizontalTransition(false);
                tt.setNode( logicalEnemy );
                tt.play();

                toLeft = false;

            }

            View.getInstance().setViewEnemiesSettings( logicalEnemy.getX() , logicalEnemy.getY()  , false , toLeft );

            if( (this.columnsPassed) >= 40 ){

                if ( this.columnsPassed == 40 )
                    setGameInfo(3);

                int randColumnEnemy = (int) (Math.random() * ( spaceInter - sizeE ));

                LogicalEnemy logicalEnemyC = new LogicalEnemy(true);
                logicalEnemyC.setX(spaceBSC);
                logicalEnemyC.setY( LogicalColumns.get( LogicalColumns.size() - 2 ).getHeight() + randColumnEnemy );

                logicalEnemies.add( logicalEnemyC );

                boolean toUp = true;



                if( logicalEnemyC.getY() - LogicalColumns.get( LogicalColumns.size() - 2 ).getHeight() > (double) spaceInter/2  ) {

                    TranslateTransition tt = verticalTransition(true);
                    tt.setNode( logicalEnemyC );
                    tt.play();

                } else {

                    TranslateTransition tt = verticalTransition(false);
                    tt.setNode( logicalEnemyC );
                    tt.play();
                    toUp = false;

                }

                View.getInstance().setViewEnemiesSettings( logicalEnemyC.getX() , logicalEnemyC.getY() , true , toUp);

            }


        }   //end if

    }   //end method


    private void removeAndAddColumnsAndEnemies(){

        for(int i = 0; i < LogicalColumns.size() ; i++){

            if(i%2 == 0 && LogicalColumns.get(0).getX() + LogicalColumns.get(0).getWidth() < 0 ){

                //Removes first 2 columns
                LogicalColumns.remove(0);
                LogicalColumns.remove(0);
                View.getInstance().removeViewColumns();

                if( (this.columnsPassed) <= 60) {       // game stop creating new columns and enemies at 60 columns passed

                    addColumns(1);
                    addEnemy();

                }

            }   // end if

            if( LogicalColumns.size() == 0 ) {  //if no columns -> gameOver
                gameEnded();
            }

        } // end for

    } // end method

    private void removeAndAddEnemies(){

        Iterator<LogicalEnemy> enemiesI = logicalEnemies.iterator();

        while(enemiesI.hasNext()){

            LogicalEnemy enemy = enemiesI.next();

            if( (enemy.getX() + enemy.getWidth()) < 0 ){

                int removeIndexEnemy = logicalEnemies.indexOf( enemy );

                enemiesI.remove();
                translateTransitions.remove( removeIndexEnemy );  //removes the corresponding Translation

                View.getInstance().removeViewEnemies( removeIndexEnemy , true );

            }

        } // end while cycle


    } // end method

    private void checksBird(){

        if( (logicalBird.getCenterY() < 0 || logicalBird.getCenterY() > SceneHeight - groundHeight ) ){

            this.gameOver = true ;
            updateTime.stop();
            View.getInstance().viewOnGameLost();

        }

    }   //end method


    private void checks(){

        removeAndAddColumnsAndEnemies();
        removeAndAddEnemies();
        checksBird();
        collisionBirdObjects();
        collisionShotsObjects();
        collisionEggsObjects();
        shotsNeggsOutofWindow();

    }   //end method



    public void setScoreColumnsPassed(){

        if (this.gameSpeed == 4) {

            for ( LogicalColumn column : LogicalColumns) {

                if ( column.getX() > (logicalBird.getCenterX() + logicalBird.getRadius() - 20) && column.getX() < ( logicalBird.getCenterX() + logicalBird.getRadius() - 15)) {        //checks range control ( moved by 4 every 16ms )
                    this.score++;
                    this.columnsPassed++;
                    View.getInstance().showScore(this.score);

                }

            }

        } // end addScore for gameSpeed = 4

        if (this.gameSpeed == 6) {

            for ( LogicalColumn column : LogicalColumns) {

                if ( column.getX() > (logicalBird.getCenterX() + logicalBird.getRadius() - 20) && column.getX() < ( logicalBird.getCenterX() + logicalBird.getRadius() - 13)) {        //checks range control ( moved by 6 every 16ms )
                    this.score++;
                    this.columnsPassed++;
                    View.getInstance().showScore(this.score);

                }

            }

        } // end addScore for gameSpeed = 6

    }   // end method



    public void collisionBirdObjects(){

        for(LogicalColumn logicalColumn : LogicalColumns) {

            if (logicalBird.getBoundsInParent().intersects( logicalColumn.getBoundsInParent() ) ){

                this.gameOver = true ;
                updateTime.stop();
                View.getInstance().viewOnGameLost();


            }   // end if

        }   // end bird - columns collision


        for(LogicalEnemy logicalEnemy : logicalEnemies){

            if( logicalBird.getBoundsInParent().intersects(  logicalEnemy.getBoundsInParent() ) ){

                this.gameOver = true ;
                updateTime.stop();
                View.getInstance().viewOnGameLost();

            }

        }    // end bird - columns collision

    }   // end method

    public void collisionShotsObjects(){

        Iterator<LogicalShot> shotsI = LogicalShots.iterator() ;

        while( shotsI.hasNext() ){  //Checks collisions with iterator to prevent any form of ConcurrentException

            LogicalShot logicalShot = shotsI.next() ;

            Iterator<LogicalEnemy> enemyI = logicalEnemies.iterator() ;
            Iterator<LogicalColumn> columnI = LogicalColumns.iterator() ;

            while( enemyI.hasNext() ){

                LogicalEnemy logicalEnemy = enemyI.next();

                if ( logicalShot.getBoundsInParent().intersects( logicalEnemy.getBoundsInParent() ) ){

                    int removeIndexEnemy = logicalEnemies.indexOf( logicalEnemy );
                    int removeIndexShot = LogicalShots.indexOf( logicalShot );

                    View.getInstance().removeViewEnemies( removeIndexEnemy , false );
                    View.getInstance().removeViewShots( removeIndexShot );

                    enemyI.remove();
                    shotsI.remove();

                    changeScore(5);

                    View.getInstance().showScore(this.score);

                }   // end if

            }   // end while enemy - shots collision

            while( columnI.hasNext() ){

                LogicalColumn logicalColumn = columnI.next() ;

                if( logicalShot.getBoundsInParent().intersects( logicalColumn.getBoundsInParent() ) ){

                    int removeIndexShot = LogicalShots.indexOf( logicalShot );

                    View.getInstance().removeViewShots(  removeIndexShot);

                    shotsI.remove();

                    changeScore(-4);

                    View.getInstance().showScore(this.score);


                }   //end if intersects

            }   // end while column - shots collision

        }   // end while shots cycle

    }   //end method

    public void collisionEggsObjects(){

        Iterator<LogicalEgg> eggsI = LogicalEggs.iterator();

        while ( eggsI.hasNext() ){  //Checks collisions with iterator to prevent any form of ConcurrentException

            LogicalEgg logicalEgg = eggsI.next();

            Iterator<LogicalEnemy> enemyI = logicalEnemies.iterator() ;
            Iterator<LogicalColumn> columnI = LogicalColumns.iterator() ;

            while( enemyI.hasNext() ){

                LogicalEnemy logicalEnemy = enemyI.next();

                if ( logicalEgg.getBoundsInParent().intersects( logicalEnemy.getBoundsInParent() ) ){

                    int removeIndexEnemy = logicalEnemies.indexOf( logicalEnemy );
                    int removeIndexEgg = LogicalEggs.indexOf( logicalEgg );

                    View.getInstance().removeViewEnemies( removeIndexEnemy , false );
                    View.getInstance().removeViewEggs( removeIndexEgg );

                    enemyI.remove();
                    eggsI.remove();

                    changeScore(5);

                    View.getInstance().showScore(this.score);

                }   // end if

            }   // end while enemy - shots collision

            while( columnI.hasNext() ){

                LogicalColumn logicalColumn = columnI.next() ;

                if( logicalEgg.getBoundsInParent().intersects( logicalColumn.getBoundsInParent() ) ){

                    int removeIndexEgg = LogicalEggs.indexOf( logicalEgg );

                    View.getInstance().removeViewEggs( removeIndexEgg );

                    eggsI.remove();

                    changeScore(-4);

                    View.getInstance().showScore(this.score);


                }   //end if intersects

            }   // end while column - eggs collision

        }   // end while eggs cycle


    }   //end method

    public void shotsNeggsOutofWindow(){

        for(int i = 0; i < LogicalShots.size() ; i++  ){

            if( !checkRect.getBoundsInParent().intersects( LogicalShots.get(i).getBoundsInParent()  ) ) {  //Checks if shots and eggs are out of the window with checkRect

                int removeIndex = i ;

                LogicalShots.remove(i);

                View.getInstance().removeViewShots( removeIndex );

                changeScore(-3);

                View.getInstance().showScore(this.score);

            }


        }   // end cycle for shots

        for (int i = 0; i < LogicalEggs.size() ; i++ ){

            if( !checkRect.getBoundsInParent().intersects( LogicalEggs.get(i).getBoundsInParent() ) ) {

                int removeIndex = i ;

                LogicalEggs.remove(i);

                View.getInstance().removeViewEggs( removeIndex );

                changeScore(-2);

                View.getInstance().showScore(this.score);

            }


        }   // end cycle for eggs


    }   //end method

    public void setGameInfo(int level){

        View.getInstance().setLevel(level);

        if( level == 2 ) {
            this.gameSpeed = 6;
        }

    }   // end method

    public void changeScore( int addChange ){

        this.score = this.score + addChange;

        if (this.score < 0 )
            this.score = 0;

    }   // end method

    public void pauseGame(){

        for(TranslateTransition tt : translateTransitions){
            tt.pause();
        }

        updateTime.pause();
        View.getInstance().setPauseView();

    }   //end method

    public void resumeGame(){

        for (TranslateTransition tt : translateTransitions){
            tt.play();
        }

        updateTime.play();
        View.getInstance().setResumeView();

    }   //end method

    public void gameEnded(){

        this.gameEnded = true;
        updateTime.stop();
        View.getInstance().viewOnGameWon();

    }   //end method

    public TranslateTransition horizontalTransition(boolean toLeft ){

        TranslateTransition tt = new TranslateTransition(Duration.millis(800) );
        tt.setAutoReverse(true);
        tt.setCycleCount(Animation.INDEFINITE);

        if(toLeft) {

            tt.setToX( -100 );

        }
        else {

            tt.setToX( 100 );

        }

        translateTransitions.add(tt);

        return tt;

    }   // end method

    public TranslateTransition verticalTransition(boolean toUp ){

        TranslateTransition tt = new TranslateTransition(Duration.millis(800) );
        tt.setAutoReverse(true);
        tt.setCycleCount(Animation.INDEFINITE);

        if(toUp) {

            tt.setToY( -50 );

        }
        else {

            tt.setToY( 50 );

        }

        translateTransitions.add(tt);

        return tt;

    }   // end method

    public int getScore(){

        return this.score;
    }   // end method

    public void setGameStarted(){

        this.gameOver = false;
        this.gameStarted = true;
        updateTime.play();

    }   // end method

    public void restart(){

        instance = null;

    } // end method


    public void setFrameJumpingTo0() {

        frameJumping = 0;

    }   // end method

    public void setJumpToTrue(){

        jump = true;

    }   // end method

    public boolean isGameOver() {

        return this.gameOver;
    }   // end method

    public boolean isGameStarted() {

        return this.gameStarted;
    }   // end method

    public boolean isGameEnded(){

        return this.gameEnded;
    }   // end method

    public void shoot(){

        Rotate rotateShot = new Rotate( rotate.getAngle() , rotate.getPivotX() , rotate.getPivotY() );
        LogicalShot shot = new LogicalShot(rotateShot);

        shot.setX( logicalWeapon.getX() );
        shot.setY( logicalWeapon.getY() + 5);

        LogicalShots.add(shot);    // adds to arraylist

        double[] shotSettings = new double[4];    // Coordinates to View
        shotSettings[0] = shot.getWidth();
        shotSettings[1] = shot.getHeight();
        shotSettings[2] = shot.getX();
        shotSettings[3] = shot.getY();

        View.getInstance().setViewShotsSettings( shotSettings , rotateShot);

    } // end method

    public void dropEgg(){

        LogicalEgg logicalEgg = new LogicalEgg();

        logicalEgg.setCenterY( logicalBird.getCenterY() + logicalBird.getRadius() + 5 );
        logicalEgg.setRadius( logicalBird.getRadius() );

        LogicalEggs.add( logicalEgg );

        double[] eggSettings = new double[2];    // Coordinates to View
        eggSettings[0] = logicalEgg.getCenterX();
        eggSettings[1] = logicalEgg.getCenterY();

        View.getInstance().setViewEggsSettings( eggSettings );

    }   // end method

    public static IUpdate getInstance(){

        if( instance == null ){

            instance = new Update();

        }

        return instance;
    }   // end method


}   // end Update (Logic) class
