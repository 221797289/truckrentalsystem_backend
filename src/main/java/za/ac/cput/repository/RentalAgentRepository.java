package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.RentalAgent;
@Repository
public interface RentalAgentRepository extends JpaRepository<RentalAgent,String> {
}
