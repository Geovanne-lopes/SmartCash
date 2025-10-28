package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.exception.ItemNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.fiap.fintech.repository.ReceitaRepository;
import br.com.fiap.fintech.service.ReceitaService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import br.com.fiap.fintech.model.Receita;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/receita")
public class ReceitaController {

    @Autowired
    private ReceitaService receitaService;

    @Autowired
    private ReceitaRepository receitaRepository;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Receita salvar(@RequestBody Receita receita){
        return receitaService.salvar(receita);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Receita> buscarTodos(){
        return receitaService.buscarTodos();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Receita buscarPorId(long id){
        return receitaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Receita atualizar(@PathVariable Long id, @RequestBody Receita receita){
        return receitaService.atualizar(id, receita);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable long id){
        Optional<Receita> receita = receitaRepository.findById(id);

        if(receita.isPresent()){
            receitaService.deletar(id);
        } else {
            throw new ItemNaoEncontradoException("receita com o ID: " + id);
        }
    }
}