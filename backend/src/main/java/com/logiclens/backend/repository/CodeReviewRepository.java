package com.logiclens.backend.repository;

import com.logiclens.backend.entity.CodeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CodeReviewRepository extends JpaRepository<CodeReview, Long> {

    // ===========================
    // HISTORY
    // ===========================

    List<CodeReview> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<CodeReview> findByIdAndUserId(Long id, Long userId);

    // ===========================
    // DASHBOARD
    // ===========================

    long countByUserId(Long userId);

    @Query("""
        SELECT AVG(r.qualityScore)
        FROM CodeReview r
        WHERE r.user.id = :userId
        """)
    Double findAverageScoreByUserId(Long userId);

    // ===========================
    // PROGRESS
    // ===========================

    List<CodeReview> findTop8ByUserIdOrderByCreatedAtAsc(Long userId);

    List<CodeReview> findByUserIdAndCreatedAtAfter(
            Long userId,
            LocalDateTime createdAt
    );

    List<CodeReview> findByUserId(Long userId);

}