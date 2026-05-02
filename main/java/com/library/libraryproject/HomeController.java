package com.library.libraryproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class HomeController {

    @Autowired
    private BookRepository repo;


    // ✅ GET ALL BOOKS
    @GetMapping("/books")
    public List<Book> getBooks() {
        return repo.findAll();
    }

    // ✅ ADD BOOK
    @GetMapping("/add")
    public String addBook(@RequestParam String name, @RequestParam String author) {
        repo.save(new Book(name, author));
        return "Book added ✅";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBook(@PathVariable int id) {
        if(!repo.existsById(id)) {
            return "Book not found ❌";
        }
        repo.deleteById(id);
        return "Book deleted ✅";
    }

    @GetMapping("/initReal100")
    public String addRealBooks() {

        String[][] books = {
                {"The Great Gatsby", "F. Scott Fitzgerald"},
                {"1984", "George Orwell"},
                {"To Kill a Mockingbird", "Harper Lee"},
                {"Pride and Prejudice", "Jane Austen"},
                {"The Hobbit", "J.R.R. Tolkien"},
                {"Moby Dick", "Herman Melville"},
                {"War and Peace", "Leo Tolstoy"},
                {"Crime and Punishment", "Fyodor Dostoevsky"},
                {"The Catcher in the Rye", "J.D. Salinger"},
                {"Brave New World", "Aldous Huxley"},

                {"Java Programming", "James Gosling"},
                {"Clean Code", "Robert C. Martin"},
                {"Design Patterns", "Erich Gamma"},
                {"Head First Java", "Kathy Sierra"},
                {"Effective Java", "Joshua Bloch"},
                {"Python Crash Course", "Eric Matthes"},
                {"Automate the Boring Stuff", "Al Sweigart"},
                {"Artificial Intelligence", "Stuart Russell"},
                {"Machine Learning", "Tom Mitchell"},
                {"Deep Learning", "Ian Goodfellow"},

                {"Operating System Concepts", "Silberschatz"},
                {"Computer Networks", "Tanenbaum"},
                {"Database System Concepts", "Korth"},
                {"Computer Organization", "Hamacher"},
                {"Software Engineering", "Pressman"},

                {"The Alchemist", "Paulo Coelho"},
                {"Rich Dad Poor Dad", "Robert Kiyosaki"},
                {"Think and Grow Rich", "Napoleon Hill"},
                {"Atomic Habits", "James Clear"},
                {"The Power of Habit", "Charles Duhigg"},

                {"Harry Potter", "J.K. Rowling"},
                {"The Da Vinci Code", "Dan Brown"},
                {"The Hunger Games", "Suzanne Collins"},
                {"The Fault in Our Stars", "John Green"},
                {"Twilight", "Stephenie Meyer"}
        };

        // add real books
        for (int i = 0; i < books.length; i++) {
            repo.save(new Book(books[i][0], books[i][1]));
        }

        // auto-generate more books to reach 100+
        for (int i = 1; i <= 70; i++) {
            repo.save(new Book("Extra Book " + i, "Author " + i));
        }

        return "100+ Books Added ✅";
    }

    @GetMapping("/search")
    public List<Book> search(@RequestParam String name) {
        return repo.findAll().stream()
                .filter(b -> b.getName() != null &&
                        b.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    @GetMapping("/stats")
    public Stats getStats() {

        List<Book> books = repo.findAll();

        int total = books.size();
        int borrowed = (int) books.stream().filter(Book::isBorrowed).count();
        int available = total - borrowed;

        return new Stats(total, borrowed, available);
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {

        if(username.equals("admin") && password.equals("1234")) {
            return "success";
        }

        return "fail";
    }

    // ✅ BORROW BOOK
    @GetMapping("/borrow/{id}")
    public String borrowBook(@PathVariable int id) {

        Optional<Book> optional = repo.findById(id);

        if(optional.isEmpty()) return "Book not found ❌";

        Book b = optional.get();

        if(b.isBorrowed()) return "Already borrowed ❌";

        b.setBorrowed(true);
        repo.save(b);

        return "Book borrowed ✅";
    }

    // ✅ RETURN BOOK
    @GetMapping("/return/{id}")
    public String returnBook(@PathVariable int id) {

        Optional<Book> optional = repo.findById(id);

        if(optional.isEmpty()) return "Book not found ❌";

        Book b = optional.get();

        if(!b.isBorrowed()) return "Already available ❌";

        b.setBorrowed(false);
        repo.save(b);

        return "Book returned ✅";
    }
}