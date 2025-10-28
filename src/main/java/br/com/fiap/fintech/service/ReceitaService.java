package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.ItemNaoEncontradoException;
import br.com.fiap.fintech.model.Receita;
import br.com.fiap.fintech.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public Receita salvar(Receita receita){
        return receitaRepository.save(receita);
    }

    public Receita buscarPorId(long id){
        Optional<Receita> receita = receitaRepository.findById(id);

        if(receita.isPresent()) {
            return receita.get();
        } else {
            throw new ItemNaoEncontradoException("receita com o ID: " + id);
        }
    }

    public List<Receita> buscarTodos(){
        return receitaRepository.findAll();
    }

    public Receita atualizar(Long id, Receita receita){
        Optional<Receita> receitaAtualizada = receitaRepository.findById(id);
        if(receitaAtualizada.isPresent()) {
            return receitaRepository.save(receita);
        } else {
            throw new RuntimeException(("Produto não encontrado..."));
        }
    }

    public void deletar(Long id){
        Optional<Receita> receitaAtualizada = receitaRepository.findById(id);

        if(receitaAtualizada.isPresent()) {
            receitaRepository.deleteById(id);
        } else {
            throw new RuntimeException(("Produto não encontrado..."));
        }
    }
}