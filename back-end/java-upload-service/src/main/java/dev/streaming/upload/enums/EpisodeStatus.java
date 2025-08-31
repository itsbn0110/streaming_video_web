package dev.streaming.upload.enums;

public enum EpisodeStatus {
    DRAFT(0),
    PUBLISHED(1),
    ARCHIVED(2);

    private final int value;

    EpisodeStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
