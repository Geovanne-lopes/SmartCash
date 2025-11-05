package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.exception.ItemNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.fiap.fintech.repository.DespesaRepository;
import br.com.fiap.fintech.service.DespesaService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import br.com.fiap.fintech.model.Despesa;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/despesa")
public class DespesaController {

    @Autowired
    private DespesaService despesaService;

    @Autowired
    private DespesaRepository despesaRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Despesa salvar(@RequestBody Despesa despesa) {
        return despesaService.salvar(despesa);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Despesa> buscarTodos() {
        return despesaService.buscarTodos();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Despesa buscarPorId(@PathVariable long id) {
        return despesaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Despesa atualizar(@PathVariable long id, @RequestBody Despesa despesa) {
        return despesaService.atualizar(id, despesa);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable long id) {
        Optional<Despesa> despesa = despesaRepository.findById(id);

        if (despesa.isPresent()) {
            despesaService.deletar(id);
        } else {
            throw new ItemNaoEncontradoException("despesa com o ID: " + id);
        }
    }
}
