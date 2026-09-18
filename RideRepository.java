package com.routewise.repository;

import com.routewise.model.Ride;
import com.routewise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserOrderByCreatedAtDesc(User user);
    List<Ride> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);
}
