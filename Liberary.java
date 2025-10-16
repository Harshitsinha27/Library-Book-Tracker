import java.util.ArrayList;
public  class Liberary {
    private ArrayList<Book>arr;
    public Liberary() {
        arr = new ArrayList<>();
    }

    public boolean addBook(String name, String Author) {
        try {
            arr.add(new Book (name, Author));
        } catch (Exception ex){
            System.out.println("Excdption happened at the time of adding the book");
            return false;
        }
        return true;
    }

    public void displayBooks() {
        if(arr.isEmpty() == true)return;
        for(int i =0;i<arr.size();i++) {
            System.out.println((i+1)+". "+arr.get(i));
        }
    }

    public void showBorrowBook() {
        if (arr.isEmpty() == true) {
            System.out.println("No books in the lib.");
            return;
        }
        for(int i = 0; i<arr.size();i++) {
            if(arr.get(i).isBorrowed() == true) {
                System.out.println((i+1)+". "+arr.get(i).getBookname());
            }
        }
    }

    public void returnBook(int IndexofBook) {
        if(!(IndexofBook >= 0 && IndexofBook < arr.size()))return false;
        if(arr.get(IndexofBook).isBorrowed())return false;
        arr.get(IndexofBook).setBorrowedStatus(flag:true);
        return true;

    }
}

