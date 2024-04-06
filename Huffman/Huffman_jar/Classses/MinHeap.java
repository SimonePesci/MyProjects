public class MinHeap {
    private BinaryTreeNode[] Heap;
    private int size;
    private int maxsize;

    private static final int FRONT = 1;

    public MinHeap(int maxsize) {
        this.maxsize = maxsize;
        this.size = 0;
        Heap = new BinaryTreeNode[this.maxsize + 1];
        Heap[0] = new BinaryTreeNode((char)(0) , Integer.MIN_VALUE);
    }

    // Function to return the position of
    // the parent for the node currently
    // at pos
    private int parent(int pos) {
        return pos / 2;
    }

    // Function to return the position of the
    // left child for the node currently at pos
    private int leftChild(int pos) {
        return (2 * pos);
    }

    // Function to return the position of
    // the right child for the node currently
    // at pos
    private int rightChild(int pos) {
        return (2 * pos) + 1;
    }


    // Function to swap two nodes of the heap
    private void swap(int fpos, int spos) {
        BinaryTreeNode tmp;
        tmp = Heap[fpos];
        Heap[fpos] = Heap[spos];
        Heap[spos] = tmp;
    }

    // Function to heapify the node at pos
    private void minHeapify(int pos) {


      int min=pos;
      if(leftChild(pos)<=size && Heap[min].freq > Heap[leftChild(pos)].freq)
          min=leftChild(pos);

            if(rightChild(min)<=size && Heap[min].freq > Heap[rightChild(pos)].freq)
                min=rightChild(pos);

            if(min!=pos ){
                swap(pos, min);
                minHeapify(pos);
            }
        }

    // Function to insert a node into the heap
    public void insert(BinaryTreeNode element) {
        if (size >= maxsize) {
            return;
        }
        Heap[++size] = element;
        int current = size;

        while (current>1 && Heap[parent(current)].freq>Heap[current].freq) {
            swap(current, parent(current));
            current = parent(current);
        }
    }

    // Function to build the min heap using
    // the minHeapify
    public void minHeap() {
        for (int pos = (size / 2); pos >= 1; pos--) {
            minHeapify(pos);
        }
    }

    // Function to remove and return the minimum
    // element from the heap
    public BinaryTreeNode remove() {
        BinaryTreeNode popped = Heap[FRONT];
        Heap[FRONT] = Heap[size--];
        minHeapify(FRONT);
        return popped;
    }



}
