import java.io.IOException;


public class Main {

    public static void main(String[] args) throws IOException {
        BinaryTreeNode[] n=Huffman.createTab();

        BinaryTreeNode test = Huffman.HuffmanTree(n);


        String s = Huffman.codifica(test , Huffman.content);

        System.out.println (Huffman.decodifica(test , s ) );


    }


}