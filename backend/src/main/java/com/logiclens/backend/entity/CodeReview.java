package com.logiclens.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CodeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Short auto-generated title, e.g. "JavaScript · 12 lines" */
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalCode;

    /** AI-generated outputs stored as JSON strings */
    @Column(columnDefinition = "TEXT")
    private String explanationJson;   // JSON array of strings

    @Column(columnDefinition = "TEXT")
    private String bugsJson;          // JSON array of bug objects

    @Column(columnDefinition = "TEXT")
    private String optimizedCode;

    @Column(columnDefinition = "TEXT")
    private String testsCode;

    private Integer qualityScore;
    private String performanceRating;
    private String securityRating;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
