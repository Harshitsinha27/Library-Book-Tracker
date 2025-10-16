package Liberary_Book_Tracker;


public class Book {
    private String name;
    private String Author;
    private boolean isBorrowed;

    public Book(String name, String Author) {
        this.name = name;
        this.Author = Author;
        this.isBorrowed = false;
    }

    public String getBookname() {
        return this.name;
    }

    public String getAuthorName() {
        return this.Author;
    }
    
    public boolean isBorrowed(){
        return this.isBorrowed;
    }
    
    public void setBorrowedStatus(Boolean flag) {
        this.isBorrowed = flag;
    }
}
