import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Huffman {

    public static String content = "";
    public static int max = 0;


    public Huffman(BinaryTreeNode[] BTN){

    }

    public static BinaryTreeNode HuffmanTree(BinaryTreeNode BTN[]){

        long d1 = System.nanoTime();
        int count = 0 ;

        for (int i = 0; i < BTN.length ; i++){
            if(BTN[i].freq != 0)
                count++;
        }

        MinHeap Q = new MinHeap(count);

        for(int i=0; i < BTN.length   ; i++){
            if(BTN[i].freq != 0)
                Q.insert(BTN[i]);
        }

        for (int i = 0 ; i < count - 1  ; i++){

            Q.minHeap();

            BinaryTreeNode newNode = new BinaryTreeNode((char)(0), 0);

            newNode.setLeft(Q.remove());
            newNode.setRight(Q.remove());


            newNode.freq = newNode.getLeft().freq + newNode.getRight().freq;
            Q.insert(newNode);

        }

        long d2 = System.nanoTime();

        System.out.println("tempo Huffman : " + (d2-d1)/1E6);

        return Q.remove();

    }

    public static String decodifica(BinaryTreeNode n,String s) {
        long d1 = System.nanoTime();
        StringBuilder decodifica = new StringBuilder();
        BinaryTreeNode n1 = n;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') {
                n1 = n1.getLeft();

            }
            else {
                n1 = n1.getRight();

            }
            if (n1.getLeft() == null && n1.getRight() == null) {
                decodifica.append(n1.character);
                n1 = n;
            }
        }

        long d2 = System.nanoTime();

        System.out.println("tempo decodifica : " + (d2-d1)/1E6);

        return decodifica.toString();
    }



    public static String codifica(BinaryTreeNode n,String s) throws IOException {
        long c1 = System.nanoTime();
        StringBuilder codifica= new StringBuilder();
        String [] codArray=new String[max+1];
        search_ric(n,codArray,"");
        for(int i=0;i<s.length();i++){
            codifica.append(codArray[(int)(s.charAt(i))]);
        }


        long c2 = System.nanoTime();
        System.out.println("tempo codifica:"+(c2-c1)/1E6);
        return codifica.toString();
    }

    private static void search_ric(BinaryTreeNode n,String[] s,String string){
        if(n.getRight()==null && n.getLeft()==null) {
            s[n.character]=string;
        }
        else{

            if(n.getLeft()!=null) {
                search_ric(n.getLeft(),s,string+"0");
            }
            if(n.getRight()!=null) {
                search_ric(n.getRight(),s,string+"1");
            }

        }
    }

    public static BinaryTreeNode[] createTab() throws IOException {
        long l1 = System.nanoTime();
        BinaryTreeNode[] n=new BinaryTreeNode[10501];   // Length of the array which allows to code Russian, Greek characters and also to code ASCII arts
        int k=0;
        String f = "Resources\\prova.txt";
        Path l = Paths.get(f);
        content = Files.readString(l , StandardCharsets.UTF_8);


        for(char c=(char)(0);c<=(char)(10500);c++){
            n[(int)(c)]=new BinaryTreeNode(c,0);
            if( (int)(c) > max)
                max = c;
        }

        for(int i=0;i<content.length();i++)
            if(n[content.charAt(i)].character==content.charAt(i))
                n[content.charAt(i)].freq++;
        long l2 = System.nanoTime();
        System.out.println("tempo lettura:"+(l2-l1)/1E6);
        return n;
    }


}
