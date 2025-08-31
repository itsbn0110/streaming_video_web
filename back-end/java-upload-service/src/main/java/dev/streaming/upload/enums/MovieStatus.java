package dev.streaming.upload.enums;

public enum MovieStatus {
    DRAFT(0),
    PUBLISHED(1),
    ARCHIVED(2);

    private final int value;

    MovieStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
