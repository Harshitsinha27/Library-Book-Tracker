package com.library.libraryproject;

public class Stats {

    private int total;
    private int borrowed;
    private int available;

    public Stats(int total, int borrowed, int available) {
        this.total = total;
        this.borrowed = borrowed;
        this.available = available;
    }

    public int getTotal() {
        return total;
    }

    public int getBorrowed() {
        return borrowed;
    }

    public int getAvailable() {
        return available;
    }
}