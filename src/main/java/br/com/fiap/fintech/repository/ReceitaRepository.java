package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

}