package Liberary_Book_Tracker;

import java.util.Scanner;

public class Executer {
    public static void main (String[] args) {
        Scanner sc = new Scanner(System.in);
        Liberary lib = new Liberary();

        while(true) {
            System.out.println("***Library Menu***");
            System.out.println("1. Show books");
            System.out.println("2. Return books");
            System.out.println("3. Borrow book");

            int ch = sc.nextInt();
            switch (ch) {
                case 1:k
                    lib.displayBooks();
                    break;
            
                case 2:
                lib.showBorrowBook();
                System.out.println("which book you can return ? ");
                int ind = sc.nextInt();
                lib.returnBook(ind);
                break;

                case 3:
                lib.displayBooks();
                System.out.println(x:"Enter the index of the book you want to borrow : ");
                int ind2 = sc.nextInt();
                if(lib.showBorrowBook(ind2)) {
                    System.out.println("Book will be issued");
                } else System.out.println("Book cant be issued");
                break;

                default:
                    break;
            }

            System.out.println("You want to continue /(1/0)");
            ch = sc.nextInt();
            if(ch != 1) break;

        }
        sc.close();
    }
}
