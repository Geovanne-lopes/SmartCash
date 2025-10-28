package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.ItemNaoEncontradoException;
import br.com.fiap.fintech.model.Despesa;
import br.com.fiap.fintech.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    public Despesa salvar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public Despesa buscarPorId(long id) {
        Optional<Despesa> despesa = despesaRepository.findById(id);

        if (despesa.isPresent()) {
            return despesa.get();
        } else {
            throw new ItemNaoEncontradoException("despesa com o ID: " + id);
        }
    }

    public List<Despesa> buscarTodos(){
        return despesaRepository.findAll();
    }

    public Despesa atualizar(long id, Despesa despesa) {
        Optional<Despesa> despesaAtualizada = despesaRepository.findById(id);

        if (despesaAtualizada.isPresent()) {
            return despesaRepository.save(despesa);
        }  else {
            throw new ItemNaoEncontradoException("despesa com o ID: " + id);
        }
    }

    public void deletar(long id) {
        Optional<Despesa> despesaAtualizada = despesaRepository.findById(id);

        if (despesaAtualizada.isPresent()) {
            despesaRepository.deleteById(id);
        }  else {
            throw new ItemNaoEncontradoException("despesa com o ID: " + id);
        }
    }
}