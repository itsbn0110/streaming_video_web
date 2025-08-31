package dev.streaming.upload.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "user_time_stats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "time_slot"})
})
public class UserTimeStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "user_id", nullable = false)
    String userId;

    @Column(name = "time_slot", nullable = false)
    @Enumerated(EnumType.STRING)
    TimeSlot timeSlot;

    @Column(name = "total_views", nullable = false, columnDefinition = "INT DEFAULT 0")
    Integer totalViews;

    @Column(name = "last_updated", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    LocalDateTime lastUpdated;

    public enum TimeSlot {
        MORNING, AFTERNOON, EVENING, NIGHT
    }
}
