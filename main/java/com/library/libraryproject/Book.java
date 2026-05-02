package com.library.libraryproject;

import jakarta.persistence.*;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String author;
    private boolean borrowed;

    // Default constructor (VERY IMPORTANT)
    public Book() {}

    public Book(String name, String author) {
        this.name = name;
        this.author = author;
        this.borrowed = false;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }

    public boolean isBorrowed() {
        return borrowed;
    }

    public void setBorrowed(boolean borrowed) {
        this.borrowed = borrowed;
    }
}